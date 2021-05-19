import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Resource, ResourceStore, ResourceTypeState } from './resources.store';

@Injectable()
export class ResourceQuery extends QueryEntity<ResourceTypeState, Resource> {
	constructor(protected store: ResourceStore) {
		super(store);
	}
}
