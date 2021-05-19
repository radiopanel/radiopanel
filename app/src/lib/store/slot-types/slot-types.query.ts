import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { SlotType, SlotTypeState, SlotTypeStore } from './slot-types.store';

@Injectable()
export class SlotTypeQuery extends QueryEntity<SlotTypeState, SlotType> {
	constructor(protected store: SlotTypeStore) {
		super(store);
	}
}
