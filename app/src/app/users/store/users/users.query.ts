import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { User, UserState, UserStore } from './users.store';

@Injectable()
export class UserQuery extends QueryEntity<UserState, User> {
	constructor(protected store: UserStore) {
		super(store);
	}
}
