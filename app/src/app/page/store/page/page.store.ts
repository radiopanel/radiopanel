import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Page {
	uuid: string;
	name: string;
	link: string;
	slug: string;
	description: string;
	showOnOverview: boolean;
	multiLanguage: boolean;
	fields: any[];
}

export interface PageState extends EntityState<Page> { }

@Injectable()
@StoreConfig({ name: 'pages', idKey: 'uuid' })
export class PageStore extends EntityStore<PageState, Page> {
  constructor() {
	super();
  }
}
