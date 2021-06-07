import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface AuthenticationMethod {
	uuid: string;
	name: string;
	type: string;
	enabled: boolean;
	config: any;
}

export interface AuthenticationMethodState extends EntityState<AuthenticationMethod> { }

@Injectable()
@StoreConfig({ name: 'authenticationMethods', idKey: 'uuid' })
export class AuthenticationMethodStore extends EntityStore<AuthenticationMethodState, AuthenticationMethod> {
	constructor() {
		super();
	}
}
