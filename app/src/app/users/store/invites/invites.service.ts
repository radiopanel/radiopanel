import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { InviteStore } from './invites.store';

@Injectable()
export class InviteService {

	constructor(
		private inviteStore: InviteStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		this.inviteStore.setLoading(true);
		return this.http.post<any>(`/api/v1/invites`, values)
			.pipe(
				tap(result => {
					this.inviteStore.add(result as any);
					this.inviteStore.setLoading(false);
				})
			);
	}

	resend(inviteUuid: string) {
		this.inviteStore.setLoading(true);
		return this.http.post<any>(`/api/v1/invites/${inviteUuid}/resend`, {})
			.pipe(
				tap(result => {
					this.inviteStore.add(result as any);
					this.inviteStore.setLoading(false);
				})
			);
	}

	delete(inviteUuid: string) {
		this.inviteStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/invites/${inviteUuid}`)
			.pipe(
				tap(result => {
					this.inviteStore.remove(inviteUuid);
					this.inviteStore.setLoading(false);
				})
			);
	}

	fetch() {
		this.inviteStore.setLoading(true);
		return this.http.get<any>(`/api/v1/invites`)
			.pipe(
				tap(result => {
					this.inviteStore.set(result._embedded);
					this.inviteStore.setLoading(false);
				})
			);
	}
}






