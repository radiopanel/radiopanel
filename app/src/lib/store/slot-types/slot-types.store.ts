import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface SlotType {
	uuid: string;
	name: string;
	description: string;
	link: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface SlotTypeState extends EntityState<SlotType> { }

@Injectable()
@StoreConfig({ name: 'slotTypes', idKey: 'uuid' })
export class SlotTypeStore extends EntityStore<SlotTypeState, SlotType> {
  constructor() {
	super();
  }
}
