import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Request, RequestState, RequestStore } from './request.store';

@Injectable()
export class RequestQuery extends QueryEntity<RequestState, Request> {
	constructor(protected store: RequestStore) {
		super(store);
	}
}
