import { SessionStore, Tenant, User } from './session.store';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class SessionService {
	constructor(
		private http: HttpClient,
		private sessionStore: SessionStore
	) {}

	updateTenant(tenant: Tenant) {
		this.sessionStore.update({ tenant });
	}

	updateUser(user: User) {
		this.sessionStore.update({ user });
	}

	updatePermissions(permissions) {
		this.sessionStore.update({ permissions });
	}

	updateFeatures(features) {
		this.sessionStore.update({ features });
	}

	updateAvailableTenants(availableTenants) {
		this.sessionStore.update({ availableTenants });
	}

	updateTenantMessages(tenantMessages: any[]) {
		this.sessionStore.update({ tenantMessages });
	}


	fetchContentTypes() {
		return this.http.get<any>('/api/v1/content-types/overview?all=true')
			.pipe(
				tap(result => {
					this.sessionStore.update({ contentTypes: result._embedded });
				})
			);
	}

	fetchPageTypes() {
		return this.http.get<any>('/api/v1/page-types/overview?all=true')
			.pipe(
				tap(result => {
					this.sessionStore.update({ pageTypes: result._embedded });
				})
			);
	}
}
