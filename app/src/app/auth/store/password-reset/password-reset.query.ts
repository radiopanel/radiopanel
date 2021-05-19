import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { PasswordReset, PasswordResetState, PasswordResetStore } from './password-reset.store';

@Injectable()
export class PasswordResetQuery extends QueryEntity<PasswordResetState, PasswordReset> {
	constructor(protected store: PasswordResetStore) {
		super(store);
	}
}
