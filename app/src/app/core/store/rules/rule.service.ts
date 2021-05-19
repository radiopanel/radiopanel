import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { RuleStore } from './rule.store';

@Injectable()
export class RuleService {

	constructor(
		private ruleStore: RuleStore,
		private http: HttpClient
	) { }

	fetchRules() {
		this.ruleStore.setLoading(true);
		return this.http.get('/api/v1/rules')
			.pipe(
				tap(rule => {
					this.ruleStore.update({
						result: rule
					});
					this.ruleStore.setLoading(false);
				})
			);
  }
}
