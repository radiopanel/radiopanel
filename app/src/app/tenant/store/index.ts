import { TenantQuery } from './tenant/tenant.query';
import { TenantService } from './tenant/tenant.service';
import { TenantStore } from './tenant/tenant.store';

export { TenantQuery } from './tenant/tenant.query';
export { TenantService } from './tenant/tenant.service';
export { TenantStore } from './tenant/tenant.store';

export const StoreServices = [
	TenantService,
];

export const Stores = [
	TenantStore,
];

export const Queries = [
	TenantQuery,
];

