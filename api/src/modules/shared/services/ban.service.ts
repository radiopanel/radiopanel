import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, LessThan, IsNull } from "typeorm";

import { Ban } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class BanService {

	constructor(
		@InjectRepository(Ban) private banRepository: Repository<Ban>,
	) { }

	public async find(page = 1, pagesize = 20, search: string = null): Promise<Paginated<Ban>> {
		const query = this.banRepository.createQueryBuilder('Ban')

		if (search) {
			query.andWhere('Ban.identifier LIKE :search', { search: `%${search}%` })
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

	public findOne(search: any): Promise<Ban | undefined> {
		return this.banRepository.findOne(search);
	}

	public async create(ban: Partial<Ban>): Promise<Ban> {
		const createdBan = await this.banRepository.save({
			uuid: uuid.v4(),
			...ban,
			updatedAt: new Date(),
			createdAt: new Date(),
		});

		return createdBan;
	}

	public async update(uuid: string, ban: Ban): Promise<Ban> {
		return this.banRepository.save({
			uuid,
			...ban,
			updatedAt: new Date(),
		});
	}

	public async delete(id: string): Promise<void> {
		await this.banRepository.delete(id);
		return;
	}

}
