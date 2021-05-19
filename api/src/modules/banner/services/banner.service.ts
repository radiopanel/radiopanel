import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { FindOneOptions, Repository } from "typeorm";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Banner } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class BannerService {
	@WebSocketServer() private server: any

	constructor(
		@InjectRepository(Banner) private bannerRepository: Repository<Banner>,
	) {}

	public async find(page = 1, pagesize = 20, random = false, tag = null): Promise<Paginated<Banner>> {
		const query = this.bannerRepository.createQueryBuilder('Banner')

		if (random) {
			query.orderBy('RANDOM()')
		}

		if (tag) {
			query.andWhere('Banner.tag = :tag', { tag })
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

	public findOne(search: unknown): Promise<Banner | undefined> {
		return this.bannerRepository.findOne(search);
	}

	public async create(banner: Banner): Promise<Banner> {
		const createdBanner = await this.bannerRepository.save({
			uuid: uuid.v4(),
			...banner,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return createdBanner;
	}

	public async update(bannerUuid: string, banner: Banner): Promise<Banner> {
		banner.uuid = bannerUuid;
		const updatedBanner = await this.bannerRepository.save(banner);

		return updatedBanner;
	}

	public async delete(bannerUuid: string): Promise<void> {
		await this.bannerRepository.delete(bannerUuid);
		return;
	}
}
