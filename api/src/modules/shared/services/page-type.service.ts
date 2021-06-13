import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, Brackets } from "typeorm";

import { PageType, Page, PageTypeField } from "~entities";
import { Paginated } from "~shared/types";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class PageTypeService {
	@WebSocketServer() private server: any

	constructor(
		@InjectRepository(PageType) private pageTypeRepository: Repository<PageType>,
		@InjectRepository(Page) private pageRepository: Repository<Page>,
		@InjectRepository(PageTypeField) private pageTypeFieldRepository: Repository<PageTypeField>
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<PageType>> {
		const query = this.pageTypeRepository.createQueryBuilder('PageType')
			.leftJoinAndSelect('PageType.fields', 'Fields')
			.leftJoinAndSelect('PageType.page', 'Page')
			.leftJoinAndSelect('Fields.subfields', 'Subfields')
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

	public async findByUuids(page = 1, pagesize = 20, allowedUuids: string[] = []): Promise<Paginated<PageType>> {
		if (allowedUuids.length === 0) {
			return {
				_embedded: [],
				_page: {
					totalEntities: 0,
					currentPage: page,
					itemsPerPage: pagesize,
				},
			};
		}

		const query = this.pageTypeRepository.createQueryBuilder('PageType')
			.where("PageType.uuid IN (:...allowedUuids)", { allowedUuids })
			.leftJoinAndSelect('PageType.fields', 'Fields')
			.leftJoinAndSelect('PageType.page', 'Page')
			.leftJoinAndSelect('Fields.subfields', 'Subfields')
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
			.leftJoinAndSelect('Fields.subfields', 'Subfields')
			.orderBy('Fields.order', 'ASC')
			.getOne();
	}

	public findOnePure(params: any): Promise<PageType | undefined> {
		return this.pageTypeRepository.findOne(params);
	}

	public async create(pageType: PageType, userUuid: string): Promise<PageType> {
		pageType.uuid = uuid.v4();
		pageType.createdAt = new Date();
		pageType.updatedAt = new Date();
		pageType.fields = this.mapFieldsWithOrder(pageType.uuid, pageType.fields || []);

		await this.pageRepository.save({
			uuid: uuid.v4(),
			pageType,
			name: pageType.name,
			slug: pageType.slug,
			createdByUuid: userUuid,
			updatedByUuid: userUuid,
			fields: {},
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		const createdPageType = await this.pageTypeRepository.save(pageType);
		this.server.emit('page-types_updated');

		return createdPageType;
	}

	public async update(id: string, pageType: PageType): Promise<PageType> {
		// First we find the current fields and kill em off
		await this.pageTypeFieldRepository.delete({
			pageTypeUuid: id,
		});

		pageType.uuid = id;
		pageType.updatedAt = new Date();
		pageType.fields = this.mapFieldsWithOrder(pageType.uuid, pageType.fields || []);

		const updatedPageType = await this.pageTypeRepository.save(pageType);
		this.server.emit('page-types_updated');

		return updatedPageType;
	}

	public async delete(id: string): Promise<void> {
		await this.pageTypeRepository.delete(id);
		this.server.emit('page-types_updated');
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
			subfields: this.mapFieldsWithOrder(pageTypeUuid, field.subfields || [], true),
		}));
	}
}
