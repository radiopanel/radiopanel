import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, Brackets } from "typeorm";

import { ContentType, ContentTypeField } from "~entities";
import { Paginated } from "~shared/types";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class ContentTypeService {
	@WebSocketServer() private server: any

	constructor(
		@InjectRepository(ContentType) private contentTypeRepository: Repository<ContentType>,
		@InjectRepository(ContentTypeField) private contentTypeFieldRepository: Repository<ContentTypeField>
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<ContentType>> {
		const query = this.contentTypeRepository.createQueryBuilder('ContentType')
			.leftJoinAndSelect('ContentType.fields', 'Fields')
			.leftJoinAndSelect('ContentType.content', 'Content')
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

	public async findByUuids(page = 1, pagesize = 20, allowedUuids: string[] = []): Promise<Paginated<ContentType>> {
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
		
		const query = this.contentTypeRepository.createQueryBuilder('ContentType')
			.where("ContentType.uuid IN (:...allowedUuids)", { allowedUuids })
			.leftJoinAndSelect('ContentType.fields', 'Fields')
			.leftJoinAndSelect('ContentType.content', 'Content')
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

	public findOne(id: string): Promise<ContentType | undefined> {
		return this.contentTypeRepository.createQueryBuilder('Content')
			.where(new Brackets(qb => qb.where('Content.uuid = :id', { id }).orWhere('Content.slug = :id', { id })))
			.leftJoinAndSelect('Content.fields', 'Fields')
			.leftJoinAndSelect('Fields.subfields', 'Subfields')
			.orderBy('Fields.order', 'ASC')
			.getOne();
	}

	public findOnePure(params: any): Promise<ContentType | undefined> {
		return this.contentTypeRepository.findOne(params);
	}

	public async create(contentType: ContentType): Promise<ContentType> {
		contentType.uuid = uuid.v4();
		contentType.createdAt = new Date();
		contentType.updatedAt = new Date();
		contentType.fields = this.mapFieldsWithOrder(contentType.uuid, contentType.fields || []);

		const createdContentType = await this.contentTypeRepository.save(contentType);
		this.server.emit('content-types_updated');

		return createdContentType;
	}

	public async update(id: string, contentType: ContentType): Promise<ContentType> {
		// First we find the current fields and kill em off
		await this.contentTypeFieldRepository.delete({
			contentTypeUuid: id,
		});

		contentType.uuid = id;
		contentType.updatedAt = new Date();
		contentType.fields = this.mapFieldsWithOrder(contentType.uuid, contentType.fields || []);

		const updatedContentType = await this.contentTypeRepository.save(contentType);
		this.server.emit('content-types_updated');

		return updatedContentType;
	}

	public async delete(id: string): Promise<void> {
		await this.contentTypeRepository.delete(id);
		this.server.emit('content-types_updated');
		return;
	}

	private mapFieldsWithOrder(contentTypeUuid: string, fields: ContentTypeField[], isSubfield = false): ContentTypeField[] {
		let order = 0;
		
		return fields.map((field) => ({
			contentTypeUuid: isSubfield ? undefined : contentTypeUuid,
			createdAt: new Date(),
			...field,
			uuid: uuid.v4(),
			updatedAt: new Date(),
			order: order++,
			subfields: this.mapFieldsWithOrder(contentTypeUuid, field.subfields || [], true),
		}));
	}
}
