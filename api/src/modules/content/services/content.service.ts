import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { ContentType, Content } from '~entities';
import { Paginated } from '~shared/types';


@Injectable()
export class ContentService {

	constructor(
    	@InjectRepository(Content) private contentRepository: Repository<Content>,
		@InjectRepository(ContentType) private contentTypeRepository: Repository<ContentType>,
	) { }

	public async findByContentType(contentTypeUuid: string, page = 1, pagesize = 20, search?: string): Promise<Paginated<Content>> {
		const contentType = await this.contentTypeRepository.findOne({
			where: [
			  { uuid: contentTypeUuid },
			  { slug: contentTypeUuid }
			]
		});

		if (!contentType) {
			throw new NotFoundException()
		}

		const query = this.contentRepository.createQueryBuilder('Content')
			.orderBy('CAST(Content.name as bytea)')
			.where('Content.contentTypeUuid = :contentTypeUuid', { contentTypeUuid: contentType.uuid });


		if (search) {
			query.andWhere('LOWER(Content.name) LIKE :search', { search: `%${search.toLowerCase()}%` });
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

	public async findOne(contentTypeUuid: string, contentUuid: string): Promise<any> {
		const contentType = await this.contentTypeRepository.findOne({
			where: [
			  { uuid: contentTypeUuid },
			  { slug: contentTypeUuid }
			]
		});

		if (!contentType) {
			throw new NotFoundException()
		}

		return this.contentRepository.findOne({
			where: [
			  { contentTypeUuid: contentType.uuid, uuid: contentUuid },
			  { contentTypeUuid: contentType.uuid, slug: contentUuid }
			]
		});
	}

	public async create(contentTypeUuid: string, content: Content): Promise<Content> {
		// Look up the contentType
		const contentType = await this.contentTypeRepository.findOne(contentTypeUuid);

		content.contentType = contentType;
		content.createdAt = new Date();
		content.updatedAt = new Date();
		content.uuid = uuid.v4();
		return await this.contentRepository.save(content);
	}

	public async update(contentTypeUuid: string, entryUuid: string, content: Content): Promise<any> {
		content.updatedAt = new Date();
		content.uuid = entryUuid;
		content.updatedAt = new Date();
		return this.contentRepository.update({ uuid: entryUuid }, content);
	}

	public async delete(contentTypeSlug: string, entryUuid: string): Promise<void> {
		await this.contentRepository.delete({
			uuid: entryUuid
		});
		return;
	}
}
