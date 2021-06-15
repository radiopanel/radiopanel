import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface SessionState {
	tenant: Tenant;
	user: User;
	permissions: string[];
	features: string[];
	contentTypes: any[];
	pageTypes: any[];
	tenantMessages: any[];
	availableTenants: Tenant[];
}

export interface Tenant {
	uuid: string;
	name: string;
	features: any[];
	settings: any;
	profileFields: any[];
	slotFields: any[];
	url: string;
}

export interface User {
	uuid: string;
	username: string;
}

export function createInitialState(): SessionState {
	return {
		tenant: null,
		user: null,
		permissions: [],
		features: [],
		contentTypes: [],
		pageTypes: [],
		availableTenants: [],
		tenantMessages: [],
	};
}

@Injectable()
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
	constructor() {
		super(createInitialState());
	}
}
