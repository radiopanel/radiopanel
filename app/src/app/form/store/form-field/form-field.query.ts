import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { FormField, FormFieldStore } from './form-field.store';

@Injectable()
export class FormFieldQuery extends Query<FormField> {
	public results$ = this.select((state) => (state as any).result);
	public loading$ = this.select((state) => (state as any).loading);

	constructor(protected store: FormFieldStore) {
		super(store);
	}
}
