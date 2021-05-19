import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface FormEntry {
	uuid: string;
	name: string;
	link: string;
	slug: string;
	description: string;
	showOnOverview: boolean;
	multiLanguage: boolean;
	fields: any[];
}

export interface FormEntryState extends EntityState<FormEntry> { }

@Injectable()
@StoreConfig({ name: 'formEntries', idKey: 'uuid' })
export class FormEntryStore extends EntityStore<FormEntryState, FormEntry> {
  constructor() {
	super();
  }
}
