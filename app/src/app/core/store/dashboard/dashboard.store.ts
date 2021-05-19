import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface Dashboard {
   name: string;
   component: string;
}

export function createInitialState() {
  return {};
}

@Injectable()
@StoreConfig({ name: 'dashboard' })
export class DashboardStore extends Store<any> {
  constructor() {
	super(createInitialState());
  }
}
