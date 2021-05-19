import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RoleStore } from './roles.store';

@Injectable()
export class RoleService {

	constructor(
		private roleStore: RoleStore,
		private http: HttpClient
	) { }

	create(values) {
		this.roleStore.setLoading(true);
		return this.http.post<any>('/api/v1/roles', values)
			.pipe(
				tap(result => {
					this.roleStore.add(result);
					this.roleStore.setLoading(false);
				})
			);
	}

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.roleStore.setLoading(true);
		return this.http.get<any>(`/api/v1/roles`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.roleStore.set(result._embedded);
					this.roleStore.update({
						pagination: result._page,
					});
					this.roleStore.setLoading(false);
				})
			);
	}

	fetchOne(id) {
		this.roleStore.setLoading(true);
		return this.http.get<any>(`/api/v1/roles/${id}`)
			.pipe(
				tap(result => {
					this.roleStore.update([result]);
					this.roleStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.roleStore.setLoading(true);
		return this.http.put<any>(`/api/v1/roles/${id}`, values)
			.pipe(
				tap((result) => {
					this.roleStore.update(result);
					this.roleStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.roleStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/roles/${id}`)
			.pipe(
				tap(() => {
					this.roleStore.remove(id);
					this.roleStore.setLoading(false);
				})
			);
	}
}
