import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Role {
	name: string;
	permissions: string[];
	updatedAt: Date;
	createdAt: Date;
}

export interface RoleState extends EntityState<Role> { }

@Injectable()
@StoreConfig({ name: 'roles', idKey: 'uuid' })
export class RoleStore extends EntityStore<RoleState, Role> {
  constructor() {
	super();
  }
}
