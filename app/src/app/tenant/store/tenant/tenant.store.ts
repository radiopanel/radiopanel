import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Tenant {
	uuid: string;
	title: string;
	start: number;
	end: number;
	settings: any;
}

export interface TenantState extends EntityState<Tenant> { }

@Injectable()
@StoreConfig({ name: 'tenants', idKey: 'uuid' })
export class TenantStore extends EntityStore<TenantState, Tenant> {
  constructor() {
	super();
  }
}
