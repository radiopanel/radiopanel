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

	findOne(inviteUuid: string, existingUser = false) {
		this.inviteStore.setLoading(true);
		return this.http.get<any>(`/api/v1/invites/${inviteUuid}`, {
			params: { existingUser: existingUser as any }
		})
			.pipe(
				tap(result => {
					this.inviteStore.add(result as any);
					this.inviteStore.setLoading(false);
				})
			);
	}

	register(inviteUuid: string, userData: any) {
		return this.http.post<any>(`/api/v1/invites/${inviteUuid}/register`, userData);
	}

	acceptInvite(inviteUuid: string) {
		return this.http.post<any>(`/api/v1/invites/${inviteUuid}/accept`, {});
	}
}






