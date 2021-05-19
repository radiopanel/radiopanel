import { BannerQuery } from './banner/banner.query';
import { BannerService } from './banner/banner.service';
import { BannerStore } from './banner/banner.store';

export { BannerQuery } from './banner/banner.query';
export { BannerService } from './banner/banner.service';
export { BannerStore } from './banner/banner.store';

export const StoreServices = [
	BannerService,
];

export const Stores = [
	BannerStore,
];

export const Queries = [
	BannerQuery,
];

