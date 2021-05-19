import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface PageTypeField {
   name: string;
   component: string;
}

export function createInitialState(): PageTypeField[] {
  return [];
}

@Injectable()
@StoreConfig({ name: 'pageTypeFields' })
export class PageTypeFieldStore extends Store<any> {
  constructor() {
	super(createInitialState());
  }
}
