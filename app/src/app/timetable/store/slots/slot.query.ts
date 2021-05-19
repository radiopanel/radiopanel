import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Slot, SlotState, SlotStore } from './slot.store';

@Injectable()
export class SlotQuery extends QueryEntity<SlotState, Slot> {
	constructor(protected store: SlotStore) {
		super(store);
	}
}
