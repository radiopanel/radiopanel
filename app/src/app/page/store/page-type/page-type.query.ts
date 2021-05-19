import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { PageType, PageTypeState, PageTypeStore } from './page-type.store';

@Injectable()
export class PageTypeQuery extends QueryEntity<PageTypeState, PageType> {
	constructor(protected store: PageTypeStore) {
		super(store);
	}
}
