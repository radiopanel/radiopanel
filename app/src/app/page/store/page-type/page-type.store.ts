import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface PageType {
	uuid: string;
	name: string;
	link: string;
	slug: string;
	description: string;
	showOnOverview: boolean;
	multiLanguage: boolean;
	fields: any[];
}

export interface PageTypeState extends EntityState<PageType> { }

@Injectable()
@StoreConfig({ name: 'pageTypes', idKey: 'uuid' })
export class PageTypeStore extends EntityStore<PageTypeState, PageType> {
  constructor() {
	super();
  }
}
