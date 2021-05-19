import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { RulePageStore } from './rule-page.store';

@Injectable()
export class RulePageService {

	constructor(
		private rulePageStore: RulePageStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		this.rulePageStore.setLoading(true);
		return this.http.post<any>(`/api/v1/rule-pages`, values)
			.pipe(
				tap(result => {
					this.rulePageStore.add(result as any);
					this.rulePageStore.setLoading(false);
				})
			);
	}

	fetchOne(rulePageId: string) {
		this.rulePageStore.setLoading(true);
		return this.http.get<any>(`/api/v1/rule-pages/${rulePageId}`)
			.pipe(
				tap(result => {
					this.rulePageStore.set([result as any]);
					this.rulePageStore.setLoading(false);
				})
			);
	}

	fetch(search?: string, { page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.rulePageStore.setLoading(true);
		return this.http.get<any>(`/api/v1/rule-pages`, {
			params: {
				...(search && { search }),
				page: page || 1,
				pagesize: pagesize || 20,
				showDraft: 'true',
			}
		})
			.pipe(
				tap(result => {
					this.rulePageStore.set(result._embedded);
					this.rulePageStore.update({
						pagination: result._page,
					});
					this.rulePageStore.setLoading(false);
				})
			);
	}

	update(rulePageId: string, values: any) {
		this.rulePageStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/rule-pages/${rulePageId}`,
			values
		)
			.pipe(
				tap(() => {
					this.rulePageStore.upsert(rulePageId, values);
					this.rulePageStore.setLoading(false);
				})
			);
	}

	delete(rulePageId: string) {
		this.rulePageStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/rule-pages/${rulePageId}`)
			.pipe(
				tap(result => {
					this.rulePageStore.remove(rulePageId);
					this.rulePageStore.setLoading(false);
				})
			);
	}
}






