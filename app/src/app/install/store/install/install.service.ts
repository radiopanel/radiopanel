import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InstallStore } from './install.store';

@Injectable()
export class InstallService {

	constructor(
		private inviteStore: InstallStore,
		private http: HttpClient,
	) { }

	register(inviteUuid: string, userData: any) {
		return this.http.post<any>(`/api/v1/install/${inviteUuid}/register`, userData);
	}

	acceptInstall(inviteUuid: string) {
		return this.http.post<any>(`/api/v1/install/${inviteUuid}/accept`, {});
	}

	fetchOne(settingId: string) {
		this.inviteStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/tenants/${settingId}`)
			.pipe(
				tap(result => {
					this.inviteStore.set([result as any]);
					this.inviteStore.setLoading(false);
				})
			);
	}

	create(values: any) {
		this.inviteStore.setLoading(true);
		return this.http.post<any>(
			`/api/v1/tenants`, values)
			.pipe(
				tap(result => {
					this.inviteStore.setLoading(false);
				})
			);
	}

	update(settingId: string, values: any) {
		this.inviteStore.setLoading(true);
		return this.http.patch<any>(
			`/api/v1/tenants/${settingId}`,
			values
		)
			.pipe(
				tap(() => {
					this.inviteStore.upsert(settingId, values);
					this.inviteStore.setLoading(false);
				})
			);
	}
}






