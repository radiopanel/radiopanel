import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { ContentTypeField, ContentTypeFieldStore } from './content-type-field.store';

@Injectable()
export class ContentTypeFieldQuery extends Query<ContentTypeField> {
	public results$ = this.select((state) => (state as any).result);
	public loading$ = this.select((state) => (state as any).loading);

	constructor(protected store: ContentTypeFieldStore) {
		super(store);
	}
}
