import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface Permission {
   label: string;
   value: string;
}

export function createInitialState(): Permission[] {
  return [];
}

@Injectable()
@StoreConfig({ name: 'permissions' })
export class PermissionStore extends Store<any> {
  constructor() {
	super(createInitialState());
  }
}
