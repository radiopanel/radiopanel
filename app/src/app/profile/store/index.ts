import { ProfileQuery } from './profile/profile.query';
import { ProfileService } from './profile/profile.service';
import { ProfileStore } from './profile/profile.store';

export { ProfileQuery } from './profile/profile.query';
export { ProfileService } from './profile/profile.service';
export { ProfileStore } from './profile/profile.store';

export const StoreServices = [
	ProfileService,
];

export const Stores = [
	ProfileStore,
];

export const Queries = [
	ProfileQuery,
];

