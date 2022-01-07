/* eslint-disable @typescript-eslint/no-empty-function */
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, Brackets, LessThan } from "typeorm";
import Spotify from 'spotify-web-api-node'
import got from "got";
import md5 from 'md5'
import moment from 'moment';
import { pathOr } from "ramda";
import { WebSocketServer, WebSocketGateway } from "@nestjs/websockets";

import { TenantService } from "~shared/services/tenant.service";
import { SongPlay, Tenant, Song } from "~entities";
import { Paginated } from "~shared/types";
import { WebhookService } from "~shared/services/webhook.service";
import { SlotService } from "~shared/services/slot.service";
import { cleanResponse } from "src/modules/core/helpers/cleanResponse";

import { serviceResponseMapper, manualSearchMapper } from "../helpers/serviceResponseMapper";
import { fetchSongData } from "../helpers/songFetcher";
import { fetchStatusFile } from "../helpers/azuraHelper";
import { Cron } from "@nestjs/schedule";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class SongService {
	@WebSocketServer() private server: any

	constructor(
		private tenantService: TenantService,
		private slotService: SlotService,
		private webhookService: WebhookService,
		@InjectRepository(SongPlay) private songPlayRepository: Repository<SongPlay>,
		@InjectRepository(Song) private songRepository: Repository<Song>,
	) { }

	public async findOne(uuid: string): Promise<Song> {
		return this.songRepository.findOneOrFail({
			uuid
		});
	}

	@Cron('*/15 * * * * *')
	public async handleCron(): Promise<void> {
		const tenant = await this.tenantService.findOne();

		if (!tenant) {
			return;
		}

		this.fetchLatestSong(tenant)
	}

	public async verifyConnection({ settings }: any): Promise<any> {
		if (settings.configurationType === 'azura') {
			const { streamType, streamUrl } = await fetchStatusFile({ settings } as any);
			return fetchSongData(streamUrl, streamType);
		} else {
			return fetchSongData(settings?.streamUrl, settings?.streamType);
		}
	}

	public async verifyMatchingService({ settings }: any): Promise<boolean> {
		if (settings.matchingService !== 'spotify') {
			return true;
		}

		if (!settings.spotifyClientId || !settings.spotifyClientSecret) {
			throw new BadRequestException('Please fill in all fields')
		}

		const spotifyApi = new Spotify({
			clientId: settings.spotifyClientId,
			clientSecret: settings.spotifyClientSecret
		});

		try {
			const { body: { access_token: accessToken } } = await spotifyApi.clientCredentialsGrant();
			spotifyApi.setAccessToken(accessToken);
		} catch (e) {
			throw new BadRequestException('Invalid spotify credentials')
		}

		return spotifyApi.searchTracks('Shygirl - SLIME')
			.then(() => true)
			.catch(() => {
				throw new BadRequestException('Invalid spotify credentials')
			})
	}

	private async fetchLatestSong(tenant: Tenant): Promise<void> {
		let songTitle;

		if (!tenant.settings) {
			return;
		}

		if (!tenant.settings.streamUrl && tenant.settings?.configurationType !== 'azura') {
			return;
		}

		if (((tenant.settings.matchingService || "spotify") === "spotify" && (!tenant.settings.spotifyClientId || !tenant.settings.spotifyClientSecret)) && tenant.settings.matchingService !== "deezer") {
			return;
		}

		if (tenant.settings?.configurationType === 'azura') {
			const { streamType, streamUrl } = await fetchStatusFile(tenant);
			songTitle = await fetchSongData(streamUrl, streamType);
		} else {
			songTitle = await fetchSongData(tenant.settings?.streamUrl, tenant.settings?.streamType);
		}

		if (!songTitle) {
			return;
		}

		const lastSongPlayed = await this.fetchLatestSongFromDatabase();
		if (lastSongPlayed && lastSongPlayed.song && lastSongPlayed.song.externalId === md5(songTitle)) {
			return;
		}

		// Check if we have a song with the md5 hash
		const existingSong = await this.songRepository.findOne({
			externalId: md5(songTitle)
		})

		const { _embedded: slots } = await this.slotService.find(moment().add(2, 'days').unix().toString(), moment().subtract(2, 'days').unix().toString());

		const currentUnixTime = moment().unix()
		const slot = (slots || []).find((slot: any) => currentUnixTime > slot.start && currentUnixTime < slot.end);

		if (existingSong) {
			this.webhookService.executeWebhook('song-history/create', existingSong);
			await this.songPlayRepository.save({
				uuid: uuid.v4(),
				songUuid: existingSong.uuid,
				slotUuid: pathOr(null, ['uuid'])(slot),
				createdAt: new Date()
			} as SongPlay);

			const songPlay = await this.fetchLatestSongFromDatabase()

			this.server.to('authenticated-users').emit('current-song-updated', cleanResponse(songPlay));
			this.server.to(`authenticated-clients/song-history/read`).emit('current-song-updated', cleanResponse(songPlay));

			return;
		}

		const response = await this.fetchFromApi(tenant, songTitle, tenant?.settings?.matchingService || "spotify");
		const mappedSong = serviceResponseMapper(songTitle, tenant?.settings?.matchingService || "spotify", response)

		if (!mappedSong) {
			return;
		}

		const song = await this.songRepository.save(mappedSong) as any;

		this.webhookService.executeWebhook('song-history/create', song);
		await this.songPlayRepository.save({
			uuid: uuid.v4(),
			songUuid: song.uuid,
			slotUuid: pathOr(null, ['uuid'])(slot),
			createdAt: new Date()
		} as SongPlay);

		const songPlay = await this.fetchLatestSongFromDatabase()

		this.server.to('authenticated-users').emit('current-song-updated', cleanResponse(songPlay));
		this.server.to(`authenticated-clients/song-history/read`).emit('current-song-updated', cleanResponse(songPlay));
	}

	public async fetchFromApi(tenant: Tenant, originalTitle: string, matchingService: string): Promise<any> {
		if (matchingService === "spotify") {
			const spotifyApi = new Spotify({
				clientId : tenant.settings.spotifyClientId,
				clientSecret : tenant.settings.spotifyClientSecret
			});

			const { body: { access_token: accessToken } } = await spotifyApi.clientCredentialsGrant();
			spotifyApi.setAccessToken(accessToken);

			let spotifyResponse;
			await spotifyApi.searchTracks(originalTitle)
				.then((body) => {
					spotifyResponse = body.body;
				})
				.catch((e) => {
					return null;
				})

			if (!spotifyResponse) {
				return null;
			}

			return spotifyResponse;
		}

		if (matchingService === "deezer") {
			return got.get(`https://api.deezer.com/search?q=${originalTitle}` ,{
				resolveBodyOnly: true,
				responseType: 'json',
			}).catch(() => {
				return null;
			});
		}

		if (matchingService === "apple-music") {
			return got.get(`https://itunes.apple.com/search?term=${encodeURI(originalTitle)}&media=music&limit=20` ,{
				resolveBodyOnly: true,
				responseType: 'json',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:82.0) Gecko/20100101 Firefox/82.0'
				}
			}).catch(() => {
				return null;
			});
		}
	}

	public async fetchLatestSongFromDatabase(): Promise<SongPlay> {
		return this.songPlayRepository.findOne({
			order: {
				createdAt: 'DESC'
			}
		});
	}

	public async manualSearch(songTitle: string): Promise<any> {
		const tenant = await this.tenantService.findOne();
		const response = await this.fetchFromApi(tenant, songTitle, tenant?.settings?.matchingService || "spotify");

		return {
			_embedded: await manualSearchMapper(tenant?.settings?.matchingService || "spotify", response)
		}
	}

	public async findSongHistory(page = 1, pagesize = 20, beforeDate?: string, afterDate?: string): Promise<Paginated<SongPlay>> {
		const query = this.songPlayRepository.createQueryBuilder('SongPlay')
			.leftJoinAndSelect('SongPlay.song', 'Song')
			.leftJoinAndSelect('SongPlay.slot', 'Slot')
			.leftJoinAndSelect('Slot.user', 'User')
			.leftJoinAndSelect('User._userMeta', 'UserMeta')
			.orderBy('SongPlay.createdAt', 'DESC');

		if (beforeDate) {
			query.andWhere('SongPlay.createdAt < :beforeDate', { beforeDate: moment.unix(Number(beforeDate)).toISOString() })
		}

		if (afterDate) {
			query.andWhere('SongPlay.createdAt > :afterDate', { afterDate: moment.unix(Number(afterDate)).toISOString() })
		}

		return {
			_embedded: await query
				.skip((page - 1) * pagesize)
				.take(pagesize)
				.getMany(),
			_page: {
				totalEntities: await query.getCount(),
				currentPage: page,
				itemsPerPage: pagesize,
			},
		};
	}

	public async find(search?: string, page = 1, pagesize = 20): Promise<Paginated<Song>> {
		const query = this.songRepository.createQueryBuilder('Song')

		if (search) {
			query.andWhere(new Brackets(qb => qb
				.where('LOWER(Song.title) LIKE LOWER(:search)', { search: `%${search}%` })
				.orWhere('LOWER(Song.artist) LIKE LOWER(:search)', { search: `%${search}%` })
				.orWhere('LOWER(Song.album) LIKE LOWER(:search)', { search: `%${search}%` })));
		}

		return {
			_embedded: await query
				.skip((page - 1) * pagesize)
				.take(pagesize)
				.getMany(),
			_page: {
				totalEntities: await query.getCount(),
				currentPage: page,
				itemsPerPage: pagesize,
			},
		};
	}

	public async create(banner: Song): Promise<Song> {
		const createdSong = await this.songRepository.save({
			uuid: uuid.v4(),
			...banner,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return createdSong;
	}

	public async update(songUuid: string, song: Song): Promise<Song> {
		song.uuid = songUuid;
		const updatedSong = await this.songRepository.save(song);

		(async () => {
			const songHistory = await this.findSongHistory(1, 20);
			this.server.to(`authenticated-clients/song-history/read`).emit('song-history-updated', cleanResponse(songHistory?._embedded || []));
		})()

		return updatedSong;
	}

	public async delete(songUuid: string): Promise<void> {
		await this.songRepository.delete({ uuid: songUuid });
		return;
	}
}
