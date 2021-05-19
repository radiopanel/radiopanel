import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ContentTypeStore } from './content-type.store';

@Injectable()
export class ContentTypeService {

	constructor(
		private contentTypeStore: ContentTypeStore,
		private http: HttpClient
	) { }

	create(values) {
		this.contentTypeStore.setLoading(true);
		return this.http.post<any>('/api/v1/content-types', values)
			.pipe(
				tap(result => {
					this.contentTypeStore.add(result as any);
					this.contentTypeStore.setLoading(false);
				})
			);
	}

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.contentTypeStore.setLoading(true);
		return this.http.get<any>(`/api/v1/content-types`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.contentTypeStore.set(result._embedded);
					this.contentTypeStore.update({
						pagination: result._page,
					});
					this.contentTypeStore.setLoading(false);
				})
			);
	}

	fetchOne(id: string) {
		this.contentTypeStore.setLoading(true);
		return this.http.get<any>(`/api/v1/content-types/${id}`)
			.pipe(
				tap(result => {
					this.contentTypeStore.add(result);
					this.contentTypeStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.contentTypeStore.setLoading(true);
		return this.http.put<any>(`/api/v1/content-types/${id}`, values)
			.pipe(
				tap((result) => {
					this.contentTypeStore.update(result.slug, result);
					this.contentTypeStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.contentTypeStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/content-types/${id}`)
			.pipe(
				tap(result => {
					this.contentTypeStore.remove(id);
					this.contentTypeStore.setLoading(false);
				})
			);
	}
}
