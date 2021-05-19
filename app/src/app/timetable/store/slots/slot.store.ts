import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface SlotType {
	name: string;
	description: string;
	color: string;
}

export interface Slot {
	title: string;
	slotType: SlotType;
	start: number;
	end: number;
}

export interface SlotState extends EntityState<Slot> { }

@Injectable()
@StoreConfig({ name: 'slots', idKey: 'start' })
export class SlotStore extends EntityStore<SlotState, Slot> {
  constructor() {
	super();
  }
}
