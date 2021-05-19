import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Profile, ProfileStore } from './profile.store';

@Injectable()
export class ProfileQuery extends Query<Profile> {
	constructor(protected store: ProfileStore) {
		super(store);
	}

	public profile$ = this.select();
}
