import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { PageType, Page } from '~entities';
import { Paginated } from '~shared/types';


@Injectable()
export class PageService {

	constructor(
    	@InjectRepository(Page) private pageRepository: Repository<Page>,
		@InjectRepository(PageType) private pageTypeRepository: Repository<PageType>,
	) { }

	public async findOne(pageTypeUuid: string): Promise<any> {
		const pageType = await this.pageTypeRepository.findOne({
			where: [
			  { uuid: pageTypeUuid },
			  { slug: pageTypeUuid }
			]
		});

		if (!pageType) {
			throw new NotFoundException()
		}

		return this.pageRepository.findOne({
			where: [
			  { pageTypeUuid: pageType.uuid },
			  { pageTypeUuid: pageType.uuid }
			]
		});
	}

	public async update(pageTypeUuid: string, updatedPage: Page): Promise<any> {
		const pageType = await this.pageTypeRepository.findOne({
			where: [
			  { slug: pageTypeUuid },
			  { uuid: pageTypeUuid }
			]
		});

		const page = await this.pageRepository.findOne({
			pageTypeUuid: pageType.uuid,
		});

		return this.pageRepository.update(page.uuid, {
			...updatedPage,
			uuid: page.uuid,
			updatedAt: new Date(),
		});
	}
}
