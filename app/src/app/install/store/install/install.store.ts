import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Install {
	uuid: string;
	email: string;
	roleUuid: string;
	tenantUuid: string;
}

export interface InstallState extends EntityState<Install> { }

@Injectable()
@StoreConfig({ name: 'install', idKey: 'uuid' })
export class InstallStore extends EntityStore<InstallState, Install> {
  constructor() {
	super();
  }
}
