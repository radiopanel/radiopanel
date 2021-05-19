import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Page, PageState, PageStore } from './page.store';

@Injectable()
export class PageQuery extends QueryEntity<PageState, Page> {
	constructor(protected store: PageStore) {
		super(store);
	}
}
