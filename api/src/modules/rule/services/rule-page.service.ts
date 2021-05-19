import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { RulePage } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class RulePageService {

	constructor(
		@InjectRepository(RulePage) private rulePageRepository: Repository<RulePage>,
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<RulePage>> {
		const query = this.rulePageRepository.createQueryBuilder('RulePage');

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

	public findOne(search: any): Promise<RulePage | undefined> {
		return this.rulePageRepository.findOne(search);
	}

	public async create(rulePage: Partial<RulePage>): Promise<RulePage> {
		const createdRulePage = await this.rulePageRepository.save({
			uuid: uuid.v4(),
			...rulePage,
			updatedAt: new Date(),
			createdAt: new Date(),
		});

		return createdRulePage;
	}

	public async update(uuid: string, rulePage: RulePage): Promise<RulePage> {
		return this.rulePageRepository.save({
			uuid,
			...rulePage,
			updatedAt: new Date(),
		});
	}

	public async delete(id: string): Promise<void> {
		await this.rulePageRepository.delete(id);
		return;
	}

}
