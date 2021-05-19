import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface ContentType {
	uuid: string;
	name: string;
	link: string;
	slug: string;
	description: string;
	showOnOverview: boolean;
	multiLanguage: boolean;
	fields: any[];
}

export interface ContentTypeState extends EntityState<ContentType> { }

@Injectable()
@StoreConfig({ name: 'contentTypes', idKey: 'uuid' })
export class ContentTypeStore extends EntityStore<ContentTypeState, ContentType> {
  constructor() {
	super();
  }
}
