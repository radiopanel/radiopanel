import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { WebhookStore } from './webhook.store';

@Injectable()
export class WebhookService {

	constructor(
		private webhookStore: WebhookStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		this.webhookStore.setLoading(true);
		return this.http.post<any>(`/api/v1/webhooks`, values)
			.pipe(
				tap(result => {
					this.webhookStore.add(result as any);
					this.webhookStore.setLoading(false);
				})
			);
	}

	fetch() {
		this.webhookStore.setLoading(true);
		return this.http.get<any>(`/api/v1/webhooks`)
			.pipe(
				tap(result => {
					this.webhookStore.set(result._embedded);
					this.webhookStore.setLoading(false);
				})
			);
	}

	fetchOne(webhookUuid: string) {
		this.webhookStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/webhooks/${webhookUuid}`)
			.pipe(
				tap(result => {
					this.webhookStore.set([result as any]);
					this.webhookStore.setLoading(false);
				})
			);
	}

	update(webhookUuid: string, values: any) {
		this.webhookStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/webhooks/${webhookUuid}`,
			values
		)
			.pipe(
				tap(() => {
					this.webhookStore.upsert(webhookUuid, values);
					this.webhookStore.setLoading(false);
				})
			);
	}

	delete(webhookUuid: string) {
		this.webhookStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/webhooks/${webhookUuid}`)
			.pipe(
				tap(result => {
					this.webhookStore.remove(webhookUuid);
					this.webhookStore.setLoading(false);
				})
			);
	}
}






