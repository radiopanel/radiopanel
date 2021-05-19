import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { PageTypeField, PageTypeFieldStore } from './page-type-field.store';

@Injectable()
export class PageTypeFieldQuery extends Query<PageTypeField> {
	public results$ = this.select((state) => (state as any).result);
	public loading$ = this.select((state) => (state as any).loading);

	constructor(protected store: PageTypeFieldStore) {
		super(store);
	}
}
