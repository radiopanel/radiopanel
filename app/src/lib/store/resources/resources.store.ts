import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Resource {
	type: 'file' | 'directory';
	name: string;
	size: number;
	lastModified: Date;
	extension?: string;
	mimeType?: string;
}

export interface ResourceTypeState extends EntityState<Resource> {}

@Injectable()
@StoreConfig({ name: 'resources', idKey: 'name' })
export class ResourceStore extends EntityStore<ResourceTypeState, Resource> {
	constructor() {
		super();
	}
}
