import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Invite {
	uuid: string;
	email: string;
	roleUuid: string;
	tenantUuid: string;
}

export interface InviteState extends EntityState<Invite> { }

@Injectable()
@StoreConfig({ name: 'invites', idKey: 'uuid' })
export class InviteStore extends EntityStore<InviteState, Invite> {
  constructor() {
	super();
  }
}
