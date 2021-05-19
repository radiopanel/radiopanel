import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Ban {
	uuid: string;
	identifier: string;
	createdBy: string;
	link: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface BanState extends EntityState<Ban> { }

@Injectable()
@StoreConfig({ name: 'bans', idKey: 'uuid' })
export class BanStore extends EntityStore<BanState, Ban> {
  constructor() {
	super();
  }
}
