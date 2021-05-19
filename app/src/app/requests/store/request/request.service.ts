import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { RequestStore } from './request.store';

@Injectable()
export class RequestService {

	constructor(
		private requestStore: RequestStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		return this.http.post<any>(`/api/v1/requests`, values)
			.pipe(
				tap(result => {
					this.requestStore.add(result as any, {
						prepend: true,
					});
				})
			);
	}

	fetch() {
		this.requestStore.setLoading(true);
		return this.http.get<any>(`/api/v1/requests`)
			.pipe(
				tap(result => {
					this.requestStore.set(result._embedded);
					this.requestStore.setLoading(false);
				})
			);
	}

	delete(requestId: string) {
		this.requestStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/requests/${requestId}`)
			.pipe(
				tap(result => {
					this.requestStore.remove(requestId);
					this.requestStore.setLoading(false);
				})
			);
	}

	clearAll() {
		this.requestStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/requests`)
			.pipe(
				tap(result => {
					this.requestStore.set([]);
					this.requestStore.setLoading(false);
				})
			);
	}
}






