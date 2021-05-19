import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ContentTypeFieldStore } from './content-type-field.store';

@Injectable()
export class ContentTypeFieldService {

	constructor(
		private contentTypeFieldStore: ContentTypeFieldStore,
		private http: HttpClient
	) { }

	fetchContentFields() {
		this.contentTypeFieldStore.setLoading(true);
		return this.http.get('/api/v1/content-type-fields')
			.pipe(
				tap(fields => {
					this.contentTypeFieldStore.update({
						result: fields
					});
					this.contentTypeFieldStore.setLoading(false);
				})
			);
  }
}
