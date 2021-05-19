import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Form {
	uuid: string;
	name: string;
	link: string;
	slug: string;
	description: string;
	showOnOverview: boolean;
	multiLanguage: boolean;
	fields: any[];
}

export interface FormState extends EntityState<Form> { }

@Injectable()
@StoreConfig({ name: 'forms', idKey: 'uuid' })
export class FormStore extends EntityStore<FormState, Form> {
  constructor() {
	super();
  }
}
