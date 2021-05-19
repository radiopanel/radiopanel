import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Dashboard, DashboardStore } from './dashboard.store';

@Injectable()
export class DashboardQuery extends Query<Dashboard> {
	public results$ = this.select((state) => (state as any).result);
	public loading$ = this.select((state) => (state as any).loading);

	constructor(protected store: DashboardStore) {
		super(store);
	}
}
