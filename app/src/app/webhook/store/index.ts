import { WebhookQuery } from './webhook/webhook.query';
import { WebhookService } from './webhook/webhook.service';
import { WebhookStore } from './webhook/webhook.store';

export { WebhookQuery } from './webhook/webhook.query';
export { WebhookService } from './webhook/webhook.service';
export { WebhookStore } from './webhook/webhook.store';

export const StoreServices = [
	WebhookService,
];

export const Stores = [
	WebhookStore,
];

export const Queries = [
	WebhookQuery,
];

