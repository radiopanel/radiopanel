import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Role, RoleState, RoleStore } from './roles.store';

@Injectable()
export class RoleQuery extends QueryEntity<RoleState, Role> {
	constructor(protected store: RoleStore) {
		super(store);
	}
}
