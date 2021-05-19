import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { ContentType, ContentTypeState, ContentTypeStore } from './content-type.store';

@Injectable()
export class ContentTypeQuery extends QueryEntity<ContentTypeState, ContentType> {
	constructor(protected store: ContentTypeStore) {
		super(store);
	}
}
