import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { AuthenticationMethodStore } from './authentication-method.store';

@Injectable()
export class AuthenticationMethodService {

	constructor(
		private authenticationMethodStore: AuthenticationMethodStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		this.authenticationMethodStore.setLoading(true);
		return this.http.post<any>(`/api/v1/authentication-methods`, values)
			.pipe(
				tap(result => {
					this.authenticationMethodStore.add(result as any);
					this.authenticationMethodStore.setLoading(false);
				})
			);
	}

	fetchOne(authenticationMethodId: string) {
		this.authenticationMethodStore.setLoading(true);
		return this.http.get<any>(`/api/v1/authentication-methods/${authenticationMethodId}`)
			.pipe(
				tap(result => {
					this.authenticationMethodStore.set([result as any]);
					this.authenticationMethodStore.setLoading(false);
				})
			);
	}

	fetch(search?: string, { page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.authenticationMethodStore.setLoading(true);
		return this.http.get<any>(`/api/v1/authentication-methods`, {
			params: {
				...(search && { search }),
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.authenticationMethodStore.set(result._embedded);
					this.authenticationMethodStore.update({
						pagination: result._page,
					});
					this.authenticationMethodStore.setLoading(false);
				})
			);
	}

	update(authenticationMethodId: string, values: any) {
		this.authenticationMethodStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/authentication-methods/${authenticationMethodId}`,
			values
		)
			.pipe(
				tap(() => {
					this.authenticationMethodStore.upsert(authenticationMethodId, values);
					this.authenticationMethodStore.setLoading(false);
				})
			);
	}

	delete(authenticationMethodId: string) {
		this.authenticationMethodStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/authentication-methods/${authenticationMethodId}`)
			.pipe(
				tap(result => {
					this.authenticationMethodStore.remove(authenticationMethodId);
					this.authenticationMethodStore.setLoading(false);
				})
			);
	}
}






