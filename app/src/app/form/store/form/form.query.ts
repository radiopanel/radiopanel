import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Form, FormState, FormStore } from './form.store';

@Injectable()
export class FormQuery extends QueryEntity<FormState, Form> {
	constructor(protected store: FormStore) {
		super(store);
	}
}
