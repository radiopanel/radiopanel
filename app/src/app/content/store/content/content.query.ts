import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Content, ContentState, ContentStore } from './content.store';

@Injectable()
export class ContentQuery extends QueryEntity<ContentState, Content> {
	constructor(protected store: ContentStore) {
		super(store);
	}
}
