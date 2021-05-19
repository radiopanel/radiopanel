import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiKeyStore } from './api-key.store';

@Injectable()
export class ApiKeyService {

	constructor(
		private apiKeyStore: ApiKeyStore,
		private http: HttpClient
	) { }

	create(values) {
		this.apiKeyStore.setLoading(true);
		return this.http.post<any>('/api/v1/api-keys', values)
			.pipe(
				tap(result => {
					this.apiKeyStore.add(result);
					this.apiKeyStore.setLoading(false);
				})
			);
	}

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.apiKeyStore.setLoading(true);
		return this.http.get<any>(`/api/v1/api-keys`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.apiKeyStore.set(result._embedded);
					this.apiKeyStore.update({
						pagination: result._page,
					});
					this.apiKeyStore.update({
						aggregation: result._aggregation,
					});
					this.apiKeyStore.setLoading(false);
				})
			);
	}

	fetchOne(id) {
		this.apiKeyStore.setLoading(true);
		return this.http.get<any>(`/api/v1/api-keys/${id}`)
			.pipe(
				tap(result => {
					this.apiKeyStore.update([result]);
					this.apiKeyStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.apiKeyStore.setLoading(true);
		return this.http.put<any>(`/api/v1/api-keys/${id}`, values)
			.pipe(
				tap((result) => {
					this.apiKeyStore.update(result);
					this.apiKeyStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.apiKeyStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/api-keys/${id}`)
			.pipe(
				tap(() => {
					this.apiKeyStore.remove(id);
					this.apiKeyStore.setLoading(false);
				})
			);
	}
}
