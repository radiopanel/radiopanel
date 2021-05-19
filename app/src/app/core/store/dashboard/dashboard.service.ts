import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DashboardStore } from './dashboard.store';

@Injectable()
export class DashboardService {

	constructor(
		private dashboardStore: DashboardStore,
		private http: HttpClient
	) { }

	fetch() {
		this.dashboardStore.setLoading(true);
		return this.http.get('/api/v1/dashboard')
			.pipe(
				tap(dashboard => {
					this.dashboardStore.update({
						result: dashboard
					});
					this.dashboardStore.setLoading(false);
				})
			);
	}

	save(dashboardDate: any) {
		return this.http.put('/api/v1/dashboard', dashboardDate);
	}
}
