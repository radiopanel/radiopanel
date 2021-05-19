import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface PasswordReset {
	uuid: string;
	emailAddress: string;
}

export interface PasswordResetState extends EntityState<PasswordReset> { }

@Injectable()
@StoreConfig({ name: 'passwordResets', idKey: 'uuid' })
export class PasswordResetStore extends EntityStore<PasswordResetState, PasswordReset> {
  constructor() {
	super();
  }
}
