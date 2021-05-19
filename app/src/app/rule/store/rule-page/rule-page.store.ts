import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface RulePage {
	uuid: string;
	title: string;
	start: number;
	end: number;
}

export interface RulePageState extends EntityState<RulePage> { }

@Injectable()
@StoreConfig({ name: 'rulePages', idKey: 'uuid' })
export class RulePageStore extends EntityStore<RulePageState, RulePage> {
  constructor() {
	super();
  }
}
