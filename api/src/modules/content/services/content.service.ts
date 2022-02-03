import { Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';
import moment from 'moment';
import { Cron } from '@nestjs/schedule';

import { ContentType, Content } from '~entities';
import { Paginated } from '~shared/types';
import { PopulationService } from '~shared/services/population.service';
import { ContentTypeService } from '~shared/services/content-type.service';
import { WebhookService } from '~shared/services/webhook.service';


@Injectable()
export class ContentService {

	constructor(
    	@InjectRepository(Content) private contentRepository: Repository<Content>,
		@InjectRepository(ContentType) private contentTypeRepository: Repository<ContentType>,
		private contentTypeService: ContentTypeService,
		private populationService: PopulationService,
		private webhookService: WebhookService,
	) { }

	public async findByContentType(contentTypeUuid: string, page = 1, pagesize = 20, filters: Record<string, string>, showUnpublished = false, sortField?: string, sortDirection?: 'ASC' | 'DESC'): Promise<Paginated<Content>> {
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
			.leftJoinAndSelect('Content.createdBy', 'CreatedBy')
			.leftJoinAndSelect('Content.updatedBy', 'UpdatedBy');

		if (sortField && sortField?.startsWith('fields.')) {
			query.orderBy(`"Content".fields->>'${sortField.replace('fields.', '').replace(/[^a-zA-Z0-9]+/g, "-")}'`, sortDirection)
		}

		if (sortField && !sortField?.startsWith('fields.')) {
			query.orderBy(`Content.${sortField.replace(/[^a-zA-Z0-9]+/g, "-")}`, sortDirection)
		}

		if (!showUnpublished) {
			query.andWhere('Content.published = TRUE');
		}

		Object.keys(filters).forEach((filterKey) => {
			if (!filterKey.startsWith('fields.')) {
				return;
			}

			const filterField = filterKey.replace('fields.', '').replace(/[^a-zA-Z0-9]+/g, "-");
			const filterValue = filters[filterKey];

			query.andWhere(`LOWER("Content".fields->>'${filterField}') LIKE LOWER(:${filterField})`, { [filterField]: `%${filterValue}%` })
		});

		if (filters.search) {
			query.andWhere(`LOWER(Content.name) LIKE LOWER(:search)`, { search: `%${filters.search.replace(/[^a-zA-Z0-9]+/g, "-")}%` })
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

	public async findOne(contentTypeUuid: string, contentUuid: string, populate = false): Promise<any> {
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
			.leftJoinAndSelect('CreatedBy._userMeta', 'CreatedByMeta')
			.leftJoinAndSelect('UpdatedBy._userMeta', 'UpdatedByMeta');

		const contentItem = await contentItemQuery.getOne();

		if (!contentItem) {
			throw new NotFoundException(null, 'Content item could not be found');
		}

		if (!populate) {
			return contentItem;
		}

		return {
			...contentItem,
			fields: await this.populationService.populateContent(contentItem.fields, contentType.fields),
		};
	}

	public async create(contentTypeUuid: string, content: Content): Promise<Content> {
		// Look up the contentType
		const contentType = await this.contentTypeRepository.findOne(contentTypeUuid);

		if (content.published === true) {
			this.webhookService.executeWebhook('content/published', content);
		}

		content.contentType = contentType;
		content.createdAt = new Date();
		content.updatedAt = new Date();
		content.uuid = uuid.v4();
		content.publishedAt = content.published ? new Date() : null
		return await this.contentRepository.save(content);
	}

	public async update(contentTypeUuid: string, entryUuid: string, content: Content): Promise<any> {
		const { published, publishedAt } = await this.contentRepository.findOne(entryUuid);

		content.updatedAt = new Date();
		content.uuid = entryUuid;
		content.updatedAt = new Date();
		content.publishedAt = published === false && content.published === true ? new Date() : publishedAt;

		if (published === false && content.published === true) {
			this.webhookService.executeWebhook('content/published', content);
		}

		return this.contentRepository.update({ uuid: entryUuid }, content);
	}

	public async delete(contentTypeSlug: string, entryUuid: string): Promise<void> {
		await this.contentRepository.delete({
			uuid: entryUuid
		});
		return;
	}

	@Cron('* * * * *')
	public async sync(): Promise<void> {
		const contentToPublish = await this.contentRepository.find({
			where: {
				publishScheduledAt: LessThan(moment().endOf('minute').toDate()),
				published: false,
			},
		});

		contentToPublish.forEach((content) => {
			this.contentRepository.save({
				...content,
				published: true,
				publishedAt: new Date(),
				publishScheduledAt: null,
			});
		});

		const contentToUnPublish = await this.contentRepository.find({
			where: {
				unPublishScheduledAt: LessThan(moment().endOf('minute').toDate()),
				published: true,
			},
		});

		contentToUnPublish.forEach((content) => {
			this.contentRepository.save({
				...content,
				published: false,
				unPublishScheduledAt: null,
			});
		});
	}
}
