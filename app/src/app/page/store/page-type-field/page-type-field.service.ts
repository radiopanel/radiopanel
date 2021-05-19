import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PageTypeFieldStore } from './page-type-field.store';

@Injectable()
export class PageTypeFieldService {

	constructor(
		private pageTypeFieldStore: PageTypeFieldStore,
		private http: HttpClient
	) { }

	fetchPageFields() {
		this.pageTypeFieldStore.setLoading(true);
		return this.http.get('/api/v1/content-type-fields')
			.pipe(
				tap(fields => {
					this.pageTypeFieldStore.update({
						result: fields
					});
					this.pageTypeFieldStore.setLoading(false);
				})
			);
  }
}
