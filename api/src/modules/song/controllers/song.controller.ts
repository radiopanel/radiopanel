import { Controller, Get, Headers, UseGuards, Param, Query, Delete, Body, Post, Put, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { Song } from '~entities';
import { AuthGuard } from '~shared/guards/auth.guard';
import { Permissions, Feature } from '~shared/decorators';

import { SongService } from '../services/song.service';

@Controller('songs')
@ApiTags('Songs')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class SongController {
	constructor(
		private songService: SongService,
	) { }

	@Get()
	@Feature('song-database')
	@Permissions('songs/read')
	public async find(@Query('search') search, @Query('page') page, @Query('pagesize') pagesize): Promise<any> {
		return this.songService.find(search, page, pagesize);
	}

	@Get('sync')
	public async sync(@Headers('authorization') authorization: string): Promise<any> {
		return this.songService.handleCron();
	}

	@Post('verify-connection')
	public async verifyConnection(@Body() testData: any): Promise<any> {
		const songTitle = await this.songService.verifyConnection(testData);

		return {
			songTitle
		}
	}

	@Post('verify-matching-service')
	public async verifyMatchingService(@Body() testData: any): Promise<any> {
		const ok = await this.songService.verifyMatchingService(testData);

		return {
			ok
		}
	}

	@Get('search')
	@Feature('song-database')
	@Permissions('songs/update')
	public async manualSearch(@Query('title') title: string): Promise<any> {
		return this.songService.manualSearch(title);
	}

	@Get(':songUuid')
	@Feature('song-database')
	@Permissions('songs/read')
	public async findOne(@Param('songUuid') songUuid: string): Promise<Song> {
		return this.songService.findOne(songUuid);
	}

	@Post()
	@Feature('song-database')
	@Permissions('songs/create')
	public async create(@Body() song: Song): Promise<any> {
		return this.songService.create(song);
	}

	@Put('/:songUuid')
	@Feature('song-database')
	@Permissions('songs/update')
	public async update(@Param('songUuid') uuid: string, @Body() song: Song): Promise<any> {
		if (!await this.songService.findOne(uuid)) {
			throw new UnauthorizedException()
		}

		return this.songService.update(uuid, {
			...song,
		});
	}

	@Delete('/:songUuid')
	@Feature('song-database')
	@Permissions('songs/update')
	public async delete(@Param('songUuid') uuid: string): Promise<any> {
		if (!await this.songService.findOne(uuid)) {
			throw new UnauthorizedException()
		}

		return this.songService.delete(uuid);
	}
}
