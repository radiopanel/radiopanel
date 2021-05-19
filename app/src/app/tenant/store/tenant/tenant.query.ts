import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Tenant, TenantState, TenantStore } from './tenant.store';

@Injectable()
export class TenantQuery extends QueryEntity<TenantState, Tenant> {
	constructor(protected store: TenantStore) {
		super(store);
	}
}
