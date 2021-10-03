import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as uuid from 'uuid';

import { PageType, Page } from '~entities';
import { PopulationService } from '~shared/services/population.service';
import { PageTypeService } from '~shared/services/page-type.service';


@Injectable()
export class PageService {

	constructor(
    	@InjectRepository(Page) private pageRepository: Repository<Page>,
		@InjectRepository(PageType) private pageTypeRepository: Repository<PageType>,
		private pageTypeService: PageTypeService,
		private populationService: PopulationService,
	) { }

	public async findOne(pageTypeUuid: string, populate = false): Promise<any> {
		const pageType = await this.pageTypeService.findOne(pageTypeUuid);

		if (!pageType) {
			throw new NotFoundException()
		}

		const pageItem = await this.pageRepository.findOne({
			where: [
			  { pageTypeUuid: pageType.uuid },
			  { pageTypeUuid: pageType.uuid }
			]
		});

		if (!populate) {
			return pageItem;
		}

		return {
			...pageItem,
			fields: this.populationService.populateContent(pageItem.fields, pageType.fields),
		};
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
