import { Injectable } from "@nestjs/common";
import { path, set, lensPath, pathOr } from "ramda";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { Content, ContentTypeField, Page, PageTypeField } from "~entities";

@Injectable()
export class PopulationService {
	constructor(
    	@InjectRepository(Content) private contentRepository: Repository<Content>,
    	@InjectRepository(Page) private pageRepository: Repository<Page>,
	) { }
	
	private createPopulateMap(
		contentFields: Record<string, unknown>,
		contentTypeFields: ContentTypeField[] | PageTypeField[],
		parentFields: (string | number)[] = []
	): { fieldPath: string; contentUuid: string, type: 'content' | 'page' }[] {
		return (contentTypeFields as any[] || []).reduce((acc, field: ContentTypeField | PageTypeField) => {
			const fieldPath = [...parentFields, field.slug]

			if (field.fieldType === 'content-input' && path([...fieldPath])(contentFields)) {
				return [
					...acc,
					{
						contentUuid: path([...fieldPath])(contentFields),
						fieldPath,
						type: 'content'
					}
				]
			}

			if (field.fieldType === 'page-input' && path([...fieldPath])(contentFields)) {
				return [
					...acc,
					{
						contentUuid: path([...fieldPath])(contentFields),
						fieldPath,
						type: 'page'
					}
				]
			}

			if (field.fieldType === 'repeater') {
				return [
					...acc,
					...(pathOr<any[]>([], [...fieldPath])(contentFields) || []).reduce((subFieldAcc, _, i: number) => ([
						...subFieldAcc,
						...this.createPopulateMap(contentFields, field.subfields, [...fieldPath, i])
					]), [])
				]
			}

			return acc;
		}, [])
	}

	public async populateContent(contentFields: Record<string, unknown>, contentTypeFields: ContentTypeField[] | PageTypeField[]): Promise<Record<string, unknown>> {
		let fields = contentFields;
		const populationMap = this.createPopulateMap(contentFields, contentTypeFields);

		if (populationMap.length === 0) {
			return contentFields;
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

			fields = set(lensPath([...population.fieldPath]), contentItem)(fields)
		})
		
		return fields;
	}
}
