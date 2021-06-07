import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { curveBasis } from 'd3-shape';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ApiKeyQuery, ApiKeyService } from '../../store';
import { values } from 'ramda';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public apiKeys$: Observable<any>;
	public loading$: Observable<boolean>;
	public pagination$: Observable<any>;
	public aggregation$: Observable<any>;
	public colorScheme = {
		domain: ['#FFF']
	};
	public curve: any = curveBasis;

	constructor(
		private apiKeyService: ApiKeyService,
		private apiKeyQuery: ApiKeyQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public parseResults(results: any[]) {
		return ;
	}

	public tracker(index) {
		return index;
	}

	public ngOnInit(): void {
		this.pagination$ = this.apiKeyQuery.select('pagination');
		this.aggregation$ = this.apiKeyQuery.select('aggregation')
			.pipe(
				map((aggregation) => ([{
					name: 'Usage',
					series: (aggregation || []).map((x) => ({
						name: new Date(x.name),
						value: Number(x.value)
					}))
				}]))
			);
		this.apiKeys$ = this.apiKeyQuery.selectAll()
			.pipe(
				map((apiKeys) => apiKeys.map((apiKey) => ({
					...apiKey,
					usage: [{
						name: 'Usage',
						series: apiKey.usage
							.slice()
							.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
							.map((x) => ({
								name: new Date(x.createdAt),
								value: x.value,
							}))
					}]
				})))
			);
		this.loading$ = this.apiKeyQuery.selectLoading();
		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.fetchContent();
	}

	public onPageUpdate(pagination) {
		this.apiKeyService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public fetchContent() {
		this.apiKeyService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
