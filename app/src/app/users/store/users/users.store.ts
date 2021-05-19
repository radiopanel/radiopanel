import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface User {
	uuid: string;
	name: string;
	link: string;
	description: string;
	fields: any[];
}

export interface UserState extends EntityState<User> { }

@Injectable()
@StoreConfig({ name: 'users', idKey: 'uuid' })
export class UserStore extends EntityStore<UserState, User> {
  constructor() {
	super();
  }
}
