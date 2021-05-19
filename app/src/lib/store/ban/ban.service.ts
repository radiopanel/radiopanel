import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BanStore } from './ban.store';

@Injectable()
export class BanService {

	constructor(
		private banStore: BanStore,
		private http: HttpClient
	) { }

	create(values) {
		this.banStore.setLoading(true);
		return this.http.post<any>('/api/v1/bans', values)
			.pipe(
				tap(result => {
					this.banStore.add(result);
					this.banStore.setLoading(false);
				})
			);
	}

	fetch(search?: string, { page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.banStore.setLoading(true);
		return this.http.get<any>(`/api/v1/bans`, {
			params: {
				...(search && { search }),
				page: page || 1,
				pagesize: pagesize || 20,
			}
		})
			.pipe(
				tap(result => {
					this.banStore.set(result._embedded);
					this.banStore.update({
						pagination: result._page,
					});
					this.banStore.setLoading(false);
				})
			);
	}

	fetchOne(id) {
		this.banStore.setLoading(true);
		return this.http.get<any>(`/api/v1/bans/${id}`)
			.pipe(
				tap(result => {
					this.banStore.update([result]);
					this.banStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.banStore.setLoading(true);
		return this.http.put<any>(`/api/v1/bans/${id}`, values)
			.pipe(
				tap((result) => {
					this.banStore.update(result);
					this.banStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.banStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/bans/${id}`)
			.pipe(
				tap(() => {
					this.banStore.remove(id);
					this.banStore.setLoading(false);
				})
			);
	}
}
