import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SlotStore } from './slot.store';

@Injectable()
export class SlotService {

	constructor(
		private slotStore: SlotStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		this.slotStore.setLoading(true);
		return this.http.post<any>(`/api/v1/slots`, values)
			.pipe(
				tap(result => {
					this.slotStore.add(result as any);
					this.slotStore.setLoading(false);
				})
			);
	}

	verify(values: any) {
		return this.http.post<any>(`/api/v1/slots/validate`, values);
	}

	fetch({ beforeDate, afterDate }: { beforeDate: string, afterDate: string }) {
		this.slotStore.setLoading(true);
		return this.http.get<any>(`/api/v1/slots`, {
			params: { beforeDate, afterDate }
		})
			.pipe(
				tap(result => {
					this.slotStore.set(result._embedded);
					this.slotStore.setLoading(false);
				})
			);
	}

	fetchOne(userId: string) {
		this.slotStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/slots/${userId}`)
			.pipe(
				tap(result => {
					this.slotStore.set([result as any]);
					this.slotStore.setLoading(false);
				})
			);
	}

	update(slotId: string, slotStart: number, values: any) {
		this.slotStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/slots/${slotId}`,
			values
		)
			.pipe(
				tap(() => {
					this.slotStore.upsert(slotStart, values);
					this.slotStore.setLoading(false);
				})
			);
	}

	delete(slotId: string, slotStart: number, body?: any) {
		this.slotStore.setLoading(true);
		return this.http.request<any>('delete', `/api/v1/slots/${slotId}`, {
			body,
		})
			.pipe(
				tap(result => {
					this.slotStore.remove(slotStart);
					this.slotStore.setLoading(false);
				})
			);
	}
}






