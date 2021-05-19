import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SlotTypeStore } from './slot-types.store';

@Injectable()
export class SlotTypeService {

	constructor(
		private slotTypeStore: SlotTypeStore,
		private http: HttpClient
	) { }

	create(values) {
		this.slotTypeStore.setLoading(true);
		return this.http.post<any>('/api/v1/slot-types', values)
			.pipe(
				tap(result => {
					this.slotTypeStore.add(result);
					this.slotTypeStore.setLoading(false);
				})
			);
	}

	fetch() {
		this.slotTypeStore.setLoading(true);
		return this.http.get<any>('/api/v1/slot-types' )
			.pipe(
				tap(result => {
					this.slotTypeStore.set(result._embedded);
					this.slotTypeStore.setLoading(false);
				})
			);
	}

	fetchOne(id) {
		this.slotTypeStore.setLoading(true);
		return this.http.get<any>(`/api/v1/slot-types/${id}`)
			.pipe(
				tap(result => {
					this.slotTypeStore.update([result]);
					this.slotTypeStore.setLoading(false);
				})
			);
	}

	update(id: string, values: any) {
		this.slotTypeStore.setLoading(true);
		return this.http.put<any>(`/api/v1/slot-types/${id}`, values)
			.pipe(
				tap((result) => {
					this.slotTypeStore.update(result);
					this.slotTypeStore.setLoading(false);
				})
			);
	}

	delete(id: string) {
		this.slotTypeStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/slot-types/${id}`)
			.pipe(
				tap(() => {
					this.slotTypeStore.remove(id);
					this.slotTypeStore.setLoading(false);
				})
			);
	}
}
