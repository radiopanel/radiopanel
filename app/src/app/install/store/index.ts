import { InstallQuery } from './install/install.query';
import { InstallService } from './install/install.service';
import { InstallStore } from './install/install.store';

export { InstallQuery } from './install/install.query';
export { InstallService } from './install/install.service';
export { InstallStore } from './install/install.store';

export const StoreServices = [
	InstallService
];

export const Stores = [
	InstallStore
];

export const Queries = [
	InstallQuery
];

