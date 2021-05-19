import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Install, InstallState, InstallStore } from './install.store';

@Injectable()
export class InstallQuery extends QueryEntity<InstallState, Install> {
	constructor(protected store: InstallStore) {
		super(store);
	}
}
