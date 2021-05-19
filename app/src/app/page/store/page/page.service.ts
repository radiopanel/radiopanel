import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PageStore } from './page.store';

@Injectable()
export class PageService {

	constructor(
		private pageStore: PageStore,
		private http: HttpClient
	) { }

	fetchOne(pageTypeUuid: string) {
		this.pageStore.setLoading(true);
		return this.http.get<any>(`/api/v1/page-types/${pageTypeUuid}/page`)
			.pipe(
				tap(result => {
					this.pageStore.add(result);
					this.pageStore.setLoading(false);
				})
			);
	}

	update(pageTypeUuid: string, entryUuid: string, values: any) {
		this.pageStore.setLoading(true);
		return this.http.put<any>(`/api/v1/page-types/${pageTypeUuid}/page`, values)
			.pipe(
				tap((result) => {
					this.pageStore.update(result.slug, result);
					this.pageStore.setLoading(false);
				})
			);
	}
}
