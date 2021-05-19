import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Webhook, WebhookState, WebhookStore } from './webhook.store';

@Injectable()
export class WebhookQuery extends QueryEntity<WebhookState, Webhook> {
	constructor(protected store: WebhookStore) {
		super(store);
	}
}
