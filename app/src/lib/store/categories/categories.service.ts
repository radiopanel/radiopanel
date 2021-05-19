import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { CategoryStore } from './categories.store';

@Injectable()
export class CategoryService {

	constructor(
		private categoryStore: CategoryStore,
		private http: HttpClient
	) { }

	create(values) {
		this.categoryStore.setLoading(true);
		return this.http.post<any>('/api/v1/categories', values)
			.pipe(
				tap(result => {
					this.categoryStore.add(result);
					this.categoryStore.setLoading(false);
				})
			);
	}

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.categoryStore.setLoading(true);
		return this.http.get<any>(`/api/v1/categories`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.categoryStore.set(result._embedded);
					this.categoryStore.update({
						pagination: result._page,
					});
					this.categoryStore.setLoading(false);
				})
			);
	}

	fetchOne(id) {
		this.categoryStore.setLoading(true);
		return this.http.get<any>(`/api/v1/categories/${id}`)
			.pipe(
				tap(result => {
					this.categoryStore.update([result]);
					this.categoryStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.categoryStore.setLoading(true);
		return this.http.put<any>(`/api/v1/categories/${id}`, values)
			.pipe(
				tap((result) => {
					this.categoryStore.update(result);
					this.categoryStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.categoryStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/categories/${id}`)
			.pipe(
				tap(() => {
					this.categoryStore.remove(id);
					this.categoryStore.setLoading(false);
				})
			);
	}
}
