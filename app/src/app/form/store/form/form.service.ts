import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormStore } from './form.store';

@Injectable()
export class FormService {

	constructor(
		private formStore: FormStore,
		private http: HttpClient
	) { }

	create(values) {
		this.formStore.setLoading(true);
		return this.http.post<any>('/api/v1/forms', values)
			.pipe(
				tap(result => {
					this.formStore.add(result as any);
					this.formStore.setLoading(false);
				})
			);
	}

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.formStore.setLoading(true);
		return this.http.get<any>(`/api/v1/forms`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.formStore.set(result._embedded);
					this.formStore.update({
						pagination: result._page,
					});
					this.formStore.setLoading(false);
				})
			);
	}

	fetchOne(id: string) {
		this.formStore.setLoading(true);
		return this.http.get<any>(`/api/v1/forms/${id}`)
			.pipe(
				tap(result => {
					this.formStore.add(result);
					this.formStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.formStore.setLoading(true);
		return this.http.put<any>(`/api/v1/forms/${id}`, values)
			.pipe(
				tap((result) => {
					this.formStore.update(result.slug, result);
					this.formStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.formStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/forms/${id}`)
			.pipe(
				tap(result => {
					this.formStore.remove(id);
					this.formStore.setLoading(false);
				})
			);
	}
}
