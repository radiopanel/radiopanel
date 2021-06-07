import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { AuthenticationMethod, AuthenticationMethodState, AuthenticationMethodStore } from './authentication-method.store';

@Injectable()
export class AuthenticationMethodQuery extends QueryEntity<AuthenticationMethodState, AuthenticationMethod> {
	constructor(protected store: AuthenticationMethodStore) {
		super(store);
	}

	public pagination$ = this.select('pagination');
}
