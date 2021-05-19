import { SlotQuery } from './slots/slot.query';
import { SlotService } from './slots/slot.service';
import { SlotStore } from './slots/slot.store';

export { SlotQuery } from './slots/slot.query';
export { SlotService } from './slots/slot.service';
export { SlotStore } from './slots/slot.store';

export const StoreServices = [
	SlotService,
];

export const Stores = [
	SlotStore,
];

export const Queries = [
	SlotQuery,
];

