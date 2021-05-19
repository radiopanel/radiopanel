import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { SlotType } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class SlotTypeService {

	constructor(
		@InjectRepository(SlotType) private slotTypeRepository: Repository<SlotType>,
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<SlotType>> {
		const query = this.slotTypeRepository.createQueryBuilder('SlotType')

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

	public findOne(search: any): Promise<SlotType | undefined> {
		return this.slotTypeRepository.findOne(search);
	}

	public async create(slotType: SlotType): Promise<SlotType> {
		return await this.slotTypeRepository.save({
			uuid: uuid.v4(),
			...slotType,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	public update(id: string, slot: SlotType): Promise<SlotType> {
		slot.uuid = id;
		return this.slotTypeRepository.save(slot);
	}

	public async delete(slotTypeUuid: string): Promise<void> {
		await this.slotTypeRepository.delete(slotTypeUuid);
		return;
	}
}
