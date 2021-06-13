import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { ContentType, Content } from '~entities';
import { Paginated } from '~shared/types';
import { PopulationService } from '~shared/services/population.service';
import { ContentTypeService } from '~shared/services/content-type.service';


@Injectable()
export class ContentService {

	constructor(
    	@InjectRepository(Content) private contentRepository: Repository<Content>,
		@InjectRepository(ContentType) private contentTypeRepository: Repository<ContentType>,
		private contentTypeService: ContentTypeService,
		private populationService: PopulationService,
	) { }

	public async findByContentType(contentTypeUuid: string, page = 1, pagesize = 20, filters: Record<string, string>, sortField?: string, sortDirection?: 'ASC' | 'DESC'): Promise<Paginated<Content>> {
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
			.where('Content.contentTypeUuid = :contentTypeUuid', { contentTypeUuid: contentType.uuid })

		if (sortField) {
			query.orderBy(`"Content".fields->>'${sortField.replace(/[^a-zA-Z0-9]+/g, "-")}'`, sortDirection)
		}

		Object.keys(filters).forEach((filterKey) => {
			if (!filterKey.startsWith('fields.')) {
				return;
			}
			const filterField = filterKey.replace('fields.', '').replace(/[^a-zA-Z0-9]+/g, "-");
			const filterValue = filters[filterKey];

			query.andWhere(`LOWER("Content".fields->>'${filterField}') LIKE LOWER(:${filterField})`, { [filterField]: `%${filterValue}%` })
		});

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

	public async findOne(contentTypeUuid: string, contentUuid: string, populate: boolean = false): Promise<any> {
		const contentType = await this.contentTypeService.findOne(contentTypeUuid);

		if (!contentType) {
			throw new NotFoundException(null, 'Content type could not be found')
		}

		const contentItemQuery = this.contentRepository.createQueryBuilder('Content')
			.where(new Brackets((qb) => qb
				.where('Content.slug = :slug', { slug: contentUuid })
				.orWhere('Content.uuid = :uuid', { uuid: contentUuid })
			))
			.andWhere('Content.contentTypeUuid = :contentTypeUuid', { contentTypeUuid })
			.leftJoinAndSelect('Content.createdBy', 'CreatedBy')
			.leftJoinAndSelect('Content.updatedBy', 'UpdatedBy')

		const contentItem = await contentItemQuery.getOne();

		if (!contentItem) {
			throw new NotFoundException(null, 'Content item could not be found');
		}

		if (!populate) {
			return contentItem;
		}

		return this.populationService.populateContent(contentItem, contentType);
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
