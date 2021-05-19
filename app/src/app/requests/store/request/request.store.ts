import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Request {
	uuid: string;
	name: string;
	type: string;
	message: string;
	requestContext: string;
	requestOrigin: string;
	updatedAt: Date;
	createdAt: Date;
	deletedAt: Date;
}

export interface RequestState extends EntityState<Request> { }

@Injectable()
@StoreConfig({ name: 'requests', idKey: 'uuid' })
export class RequestStore extends EntityStore<RequestState, Request> {
  constructor() {
	super();
  }
}
