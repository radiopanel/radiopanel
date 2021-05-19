import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, Brackets } from "typeorm";

import { PageType, Page, PageTypeField } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class PageTypeService {

	constructor(
		@InjectRepository(PageType) private pageTypeRepository: Repository<PageType>,
		@InjectRepository(Page) private pageRepository: Repository<Page>,
		@InjectRepository(PageTypeField) private pageTypeFieldRepository: Repository<PageTypeField>
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<PageType>> {
		const query = this.pageTypeRepository.createQueryBuilder('PageType')
			.leftJoinAndSelect('PageType.fields', 'Fields')
			.leftJoinAndSelect('PageType.page', 'Page')
			.orderBy('Fields.order', 'ASC');

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

	public findOne(id: string): Promise<PageType | undefined> {
		return this.pageTypeRepository.createQueryBuilder('Page')
			.where(new Brackets(qb => qb.where('Page.uuid = :id', { id }).orWhere('Page.slug = :id', { id })))
			.leftJoinAndSelect('Page.fields', 'Fields')
			.orderBy('Fields.order', 'ASC')
			.getOne();
	}

	public findOnePure(params: any): Promise<PageType | undefined> {
		return this.pageTypeRepository.findOne(params);
	}

	public async create(pageType: PageType): Promise<PageType> {
		pageType.uuid = uuid.v4();
		pageType.createdAt = new Date();
		pageType.updatedAt = new Date();
		pageType.fields = this.mapFieldsWithOrder(pageType.uuid, pageType.fields || []);

		await this.pageRepository.save({
			uuid: uuid.v4(),
			pageType,
			name: pageType.name,
			slug: pageType.slug,
			fields: {},
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return await this.pageTypeRepository.save(pageType);
	}

	public async update(id: string, pageType: PageType): Promise<any> {
		// First we find the current fields and kill em off
		await this.pageTypeFieldRepository.delete({
			pageTypeUuid: id,
		});

		pageType.uuid = id;
		pageType.updatedAt = new Date();
		pageType.fields = this.mapFieldsWithOrder(pageType.uuid, pageType.fields || []);

		return this.pageTypeRepository.save(pageType);
	}

	public async delete(id: string): Promise<void> {
		await this.pageTypeRepository.delete(id);
		return;
	}

	private mapFieldsWithOrder(pageTypeUuid: string, fields: PageTypeField[], isSubfield = false): PageTypeField[] {
		let order = 0;
		return fields.map((field) => ({
			pageTypeUuid: isSubfield ? undefined : pageTypeUuid,
			createdAt: new Date(),
			...field,
			uuid: uuid.v4(),
			updatedAt: new Date(),
			order: order++,
		}));
	}
}
