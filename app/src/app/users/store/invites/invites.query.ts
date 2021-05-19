import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Invite, InviteState, InviteStore } from './invites.store';

@Injectable()
export class InviteQuery extends QueryEntity<InviteState, Invite> {
	constructor(protected store: InviteStore) {
		super(store);
	}
}
