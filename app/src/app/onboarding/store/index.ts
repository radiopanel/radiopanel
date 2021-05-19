import { InviteQuery } from './invites/invites.query';
import { InviteService } from './invites/invites.service';
import { InviteStore } from './invites/invites.store';

export { InviteQuery } from './invites/invites.query';
export { InviteService } from './invites/invites.service';
export { InviteStore } from './invites/invites.store';

export const StoreServices = [
	InviteService
];

export const Stores = [
	InviteStore
];

export const Queries = [
	InviteQuery
];

