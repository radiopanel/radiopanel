import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { UserStore } from './users.store';

@Injectable()
export class UserService {

	constructor(
		private userStore: UserStore,
		private http: HttpClient,
	) { }

	// create(values: any) {
	// 	 this.userStore.setLoading(true);
	// 	 return this.http.post<any>(`/api/v1/users`, values)
	// 		 .pipe(
	// 			 tap(result => {
	// 				 this.userStore.add(result as any);
	// 				 this.userStore.setLoading(false);
	// 			 })
	// 		 );
	// }

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.userStore.setLoading(true);
		return this.http.get<any>(`/api/v1/users`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.userStore.set(result._embedded);
					this.userStore.update({
						pagination: result._page,
					});
					this.userStore.setLoading(false);
				})
			);
	}

	fetchOne(userId: string) {
		this.userStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/users/${userId}`)
			.pipe(
				tap(result => {
					this.userStore.set([result as any]);
					this.userStore.setLoading(false);
				})
			);
	}

	update(userId: string, values: any) {
		this.userStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/users/${userId}`,
			values
		)
			.pipe(
				tap(() => {
					this.userStore.set([values]);
					this.userStore.setLoading(false);
				})
			);
	}

	delete(userId: string) {
		this.userStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/users/${userId}`)
			.pipe(
				tap(result => {
					this.userStore.remove(userId);
					this.userStore.setLoading(false);
				})
			);
	}
}






