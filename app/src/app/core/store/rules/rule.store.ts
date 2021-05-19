import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface Rule {
   rules: string;
}

export function createInitialState() {
  return {};
}

@Injectable()
@StoreConfig({ name: 'rules' })
export class RuleStore extends Store<any> {
  constructor() {
	super(createInitialState());
  }
}
