import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Webhook {
	uuid: string;
	type: string;
	url: number;
	lastStatus: any;
	createdAt: Date;
	updatedAt: Date;
}

export interface WebhookState extends EntityState<Webhook> { }

@Injectable()
@StoreConfig({ name: 'webhooks', idKey: 'uuid' })
export class WebhookStore extends EntityStore<WebhookState, Webhook> {
  constructor() {
	super();
  }
}
