import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';

import { Rule, RuleStore } from './rule.store';

@Injectable()
export class RuleQuery extends Query<Rule> {
	public results$ = this.select((state) => (state as any).result);
	public loading$ = this.select((state) => (state as any).loading);

	constructor(protected store: RuleStore) {
		super(store);
	}
}
