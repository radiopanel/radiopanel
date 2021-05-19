import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { TenantStore } from './tenant.store';

@Injectable()
export class TenantService {

	constructor(
		private tenantStore: TenantStore,
		private http: HttpClient,
	) { }

	fetchOne(settingId: string) {
		this.tenantStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/tenants/${settingId}`)
			.pipe(
				tap(result => {
					this.tenantStore.set([result as any]);
					this.tenantStore.setLoading(false);
				})
			);
	}

	create(values: any) {
		this.tenantStore.setLoading(true);
		return this.http.post<any>(
			`/api/v1/tenants`, values)
			.pipe(
				tap(result => {
					this.tenantStore.setLoading(false);
				})
			);
	}

	update(settingId: string, values: any) {
		this.tenantStore.setLoading(true);
		return this.http.patch<any>(
			`/api/v1/tenants/${settingId}`,
			values
		)
			.pipe(
				tap(() => {
					this.tenantStore.upsert(settingId, values);
					this.tenantStore.setLoading(false);
				})
			);
	}
}
