import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ContentStore } from './content.store';

@Injectable()
export class ContentService {

	constructor(
		private contentStore: ContentStore,
		private http: HttpClient
	) { }

	create(formUuid: string, values: unknown) {
		this.contentStore.setLoading(true);
		return this.http.post<any>(`/api/v1/content-types/${formUuid}/content`, values)
			.pipe(
				tap(result => {
					this.contentStore.add(result as any);
					this.contentStore.setLoading(false);
				})
			);
	}

	fetch(formUuid: string, { page, pagesize }: { page?: any, pagesize?: any } = {}, search?: string, sort?: string) {
		this.contentStore.setLoading(true);
		return this.http.get<any>(`/api/v1/content-types/${formUuid}/content`, {
			params: {
				...(search && { search }),
				...(sort && { sort }),
				page: page || 1,
				pagesize: pagesize || 20,
				showUnpublished: 'true',
			}
		})
			.pipe(
				tap(result => {
					this.contentStore.set(result._embedded);
					this.contentStore.update({
						pagination: result._page,
					});
					this.contentStore.setLoading(false);
				})
			);
	}

	fetchOne(formUuid: string, entryUuid: string) {
		this.contentStore.setLoading(true);
		return this.http.get<any>(`/api/v1/content-types/${formUuid}/content/${entryUuid}`)
			.pipe(
				tap(result => {
					this.contentStore.add(result);
					this.contentStore.setLoading(false);
				})
			);
	}

	update(formUuid: string, entryUuid: string, values: any) {
		this.contentStore.setLoading(true);
		return this.http.put<any>(`/api/v1/content-types/${formUuid}/content/${entryUuid}`, values)
			.pipe(
				tap((result) => {
					this.contentStore.update(result.slug, result);
					this.contentStore.setLoading(false);
				})
			);
	}

	delete(formUuid: string, entryUuid: string) {
		this.contentStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/content-types/${formUuid}/content/${entryUuid}`)
			.pipe(
				tap(result => {
					this.contentStore.remove(entryUuid);
					this.contentStore.setLoading(false);
				})
			);
	}
}
