import { Injectable, ForbiddenException } from "@nestjs/common";
import { path, set, lensPath } from "ramda";

import { Content, ContentType, ContentTypeField, Page, PageType, PageTypeField } from "~entities";

import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PopulationService {
	constructor(
    	@InjectRepository(Content) private contentRepository: Repository<Content>,
    	@InjectRepository(Page) private pageRepository: Repository<Page>,
	) { }
	
	private createPopulateMap(
		fields: ContentTypeField[] | PageTypeField[],
		contentItem: Content | Page,
		parentFields: string[] = []
	): { fieldPath: string; contentUuid: string, type: 'content' | 'page' }[] {
		return (fields as any[]).reduce((acc, field: ContentTypeField | PageTypeField) => {
			const fieldPath = [...parentFields, field.slug]

			if (field.fieldType === 'content-input' && path(['fields', ...fieldPath])(contentItem)) {
				return [
					...acc,
					{
						contentUuid: path(['fields', ...fieldPath])(contentItem),
						fieldPath,
						type: 'content'
					}
				]
			}

			if (field.fieldType === 'page-input' && path(['fields', ...fieldPath])(contentItem)) {
				return [
					...acc,
					{
						contentUuid: path(['fields', ...fieldPath])(contentItem),
						fieldPath,
						type: 'page'
					}
				]
			}

			if (field.fieldType === 'repeater') {
				return [
					...acc,
					...path<any[]>(['fields', ...fieldPath])(contentItem).reduce((subFieldAcc, _, i: number) => ([
						...subFieldAcc,
						...this.createPopulateMap(field.subfields, contentItem, [...fieldPath, i.toString()])
					]), [])
				]
			}

			return acc;
		}, [])
	}

	public async populateContent(contentItem: Content | Page, contentType: ContentType | PageType): Promise<Content | Page> {
		let content = contentItem;
		const populationMap = this.createPopulateMap(contentType.fields, contentItem);

		if (populationMap.length === 0) {
			return contentItem;
		}

		const contentItemUuids = populationMap
			.filter(x => x.type === 'content')
			.map(x => x.contentUuid);
		const pageItemUuids = populationMap
			.filter(x => x.type === 'page')
			.map(x => x.contentUuid);

		const [contentItems, pageItems] = await Promise.all([
			contentItemUuids.length ? this.contentRepository.createQueryBuilder('Content')
				.where("Content.uuid IN (:...uuids)", { uuids: [...new Set(contentItemUuids)]})
				.getMany() : Promise.resolve([]),
			pageItemUuids.length ? this.pageRepository.createQueryBuilder('Page')
				.where("Page.pageTypeUuid IN (:...uuids)", { uuids: [...new Set(pageItemUuids)]})
				.getMany() : Promise.resolve([])
		])
			
		populationMap.forEach((population) => {
			const contentItem = population.type === 'content' ?
				contentItems.find(x => x.uuid === population.contentUuid) :
				pageItems.find(x => x.pageTypeUuid === population.contentUuid);

			content = set(lensPath(['fields', ...population.fieldPath]), contentItem)(content)
		})
		
		return content;
	}
}
