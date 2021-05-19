import { Query } from '@datorama/akita';
import { StatusState, StatusStore } from './status.store';
import { Injectable } from '@angular/core';

@Injectable()
export class StatusQuery extends Query<StatusState> {
	public status$ = this.select();

	constructor(
		protected store: StatusStore
	) {
		super(store);
	}
}
