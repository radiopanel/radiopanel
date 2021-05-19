import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormFieldStore } from './form-field.store';

@Injectable()
export class FormFieldService {

	constructor(
		private formFieldStore: FormFieldStore,
		private http: HttpClient
	) { }

	fetchContentFields() {
		this.formFieldStore.setLoading(true);
		return this.http.get('/api/v1/form-fields')
			.pipe(
				tap(fields => {
					this.formFieldStore.update({
						result: fields
					});
					this.formFieldStore.setLoading(false);
				})
			);
  }
}
