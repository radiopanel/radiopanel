import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface FormField {
   name: string;
   component: string;
}

export function createInitialState(): FormField[] {
  return [];
}

@Injectable()
@StoreConfig({ name: 'formFields' })
export class FormFieldStore extends Store<any> {
  constructor() {
	super(createInitialState());
  }
}
