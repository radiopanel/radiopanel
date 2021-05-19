import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { FormEntry, FormEntryState, FormEntryStore } from './form-entry.store';

@Injectable()
export class FormEntryQuery extends QueryEntity<FormEntryState, FormEntry> {
	constructor(protected store: FormEntryStore) {
		super(store);
	}
}
