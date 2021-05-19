import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface ContentTypeField {
   name: string;
   component: string;
}

export function createInitialState(): ContentTypeField[] {
  return [];
}

@Injectable()
@StoreConfig({ name: 'contentTypeFields' })
export class ContentTypeFieldStore extends Store<any> {
  constructor() {
	super(createInitialState());
  }
}
