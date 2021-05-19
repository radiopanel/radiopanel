import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PageTypeStore } from './page-type.store';

@Injectable()
export class PageTypeService {

	constructor(
		private pageTypeStore: PageTypeStore,
		private http: HttpClient
	) { }

	create(values) {
		this.pageTypeStore.setLoading(true);
		return this.http.post<any>('/api/v1/page-types', values)
			.pipe(
				tap(result => {
					this.pageTypeStore.add(result as any);
					this.pageTypeStore.setLoading(false);
				})
			);
	}

	fetch() {
		this.pageTypeStore.setLoading(true);
		return this.http.get<any>('/api/v1/page-types')
			.pipe(
				tap(result => {
					this.pageTypeStore.set(result._embedded);
					this.pageTypeStore.setLoading(false);
				})
			);
	}

	fetchOne(id: string) {
		this.pageTypeStore.setLoading(true);
		return this.http.get<any>(`/api/v1/page-types/${id}`)
			.pipe(
				tap(result => {
					this.pageTypeStore.add(result);
					this.pageTypeStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.pageTypeStore.setLoading(true);
		return this.http.put<any>(`/api/v1/page-types/${id}`, values)
			.pipe(
				tap((result) => {
					this.pageTypeStore.update(result.slug, result);
					this.pageTypeStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.pageTypeStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/page-types/${id}`)
			.pipe(
				tap(result => {
					this.pageTypeStore.remove(id);
					this.pageTypeStore.setLoading(false);
				})
			);
	}
}
