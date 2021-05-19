import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Content {
	uuid: string;
	name: string;
	link: string;
	slug: string;
	description: string;
	showOnOverview: boolean;
	multiLanguage: boolean;
	fields: any[];
}

export interface ContentState extends EntityState<Content> { }

@Injectable()
@StoreConfig({ name: 'content', idKey: 'uuid' })
export class ContentStore extends EntityStore<ContentState, Content> {
  constructor() {
	super();
  }
}
