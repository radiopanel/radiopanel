import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Permission, PermissionStore } from './permissions.store';

@Injectable()
export class PermissionQuery extends Query<Permission> {
	public results$ = this.select((state) => (state as any).result);
	public loading$ = this.select((state) => (state as any).loading);

	constructor(protected store: PermissionStore) {
		super(store);
	}
}
