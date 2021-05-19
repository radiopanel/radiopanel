import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { RulePage, RulePageState, RulePageStore } from './rule-page.store';

@Injectable()
export class RulePageQuery extends QueryEntity<RulePageState, RulePage> {
	constructor(protected store: RulePageStore) {
		super(store);
	}

	public pagination$ = this.select('pagination');
}
