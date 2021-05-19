import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface StatusState {
	status: string;
	version: string;
}

export function createInitialState(): StatusState {
	return {
		status: null,
		version: null,
	};
}

@Injectable()
@StoreConfig({ name: 'Status' })
export class StatusStore extends Store<StatusState> {
	constructor() {
		super(createInitialState());
	}
}
