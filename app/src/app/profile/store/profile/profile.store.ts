import { StoreConfig, Store } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Profile {
	uuid: string;
	username: string;
	email: string;
	avatar: string;
}

export const createInitialState = (): Profile => {
	return {
		uuid: '',
		username: '',
		email: '',
		avatar: '',
	};
};

@Injectable()
@StoreConfig({ name: 'profile', idKey: 'uuid' })
export class ProfileStore extends Store<Profile> {
  constructor() {
	super(createInitialState());
  }
}
