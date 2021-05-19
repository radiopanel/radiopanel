import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { FormEntryStore } from './form-entry.store';

@Injectable()
export class FormEntryService {

	constructor(
		private formEntryStore: FormEntryStore,
		private http: HttpClient
	) { }

	create(formUuid: string, values: unknown) {
		this.formEntryStore.setLoading(true);
		return this.http.post<any>(`/api/v1/forms/${formUuid}/entries`, values)
			.pipe(
				tap(result => {
					this.formEntryStore.add(result as any);
					this.formEntryStore.setLoading(false);
				})
			);
	}

	fetch(formUuid: string, { page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.formEntryStore.setLoading(true);
		return this.http.get<any>(`/api/v1/forms/${formUuid}/entries`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.formEntryStore.set(result._embedded);
					this.formEntryStore.update({
						pagination: result._page,
					});
					this.formEntryStore.setLoading(false);
				})
			);
	}

	fetchOne(formUuid: string, entryUuid: string) {
		this.formEntryStore.setLoading(true);
		return this.http.get<any>(`/api/v1/forms/${formUuid}/entries/${entryUuid}`)
			.pipe(
				tap(result => {
					this.formEntryStore.add(result);
					this.formEntryStore.setLoading(false);
				})
			);
	}

	update(formUuid: string, entryUuid: string, values: any) {
		this.formEntryStore.setLoading(true);
		return this.http.put<any>(`/api/v1/forms/${formUuid}/entries/${entryUuid}`, values)
			.pipe(
				tap((result) => {
					this.formEntryStore.update(result.slug, result);
					this.formEntryStore.setLoading(false);
				})
			);
	}

	delete(formUuid: string, entryUuid: string) {
		this.formEntryStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/forms/${formUuid}/entries/${entryUuid}`)
			.pipe(
				tap(result => {
					this.formEntryStore.remove(entryUuid);
					this.formEntryStore.setLoading(false);
				})
			);
	}
}
