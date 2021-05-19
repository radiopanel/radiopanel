import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, Brackets } from "typeorm";

import { ContentType, ContentTypeField } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class ContentTypeService {

	constructor(
		@InjectRepository(ContentType) private contentTypeRepository: Repository<ContentType>,
		@InjectRepository(ContentTypeField) private contentTypeFieldRepository: Repository<ContentTypeField>
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<ContentType>> {
		const query = this.contentTypeRepository.createQueryBuilder('ContentType')
			.leftJoinAndSelect('ContentType.fields', 'Fields')
			.leftJoinAndSelect('ContentType.content', 'Content')
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

		return await this.contentTypeRepository.save(contentType);
	}

	public async update(id: string, contentType: ContentType): Promise<any> {
		// First we find the current fields and kill em off
		await this.contentTypeFieldRepository.delete({
			contentTypeUuid: id,
		});

		contentType.uuid = id;
		contentType.updatedAt = new Date();
		contentType.fields = this.mapFieldsWithOrder(contentType.uuid, contentType.fields || []);

		return this.contentTypeRepository.save(contentType);
	}

	public async delete(id: string): Promise<void> {
		await this.contentTypeRepository.delete(id);
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
		}));
	}
}
