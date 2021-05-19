import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { WebhookService, WebhookQuery } from '../../store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public webhooks$: Observable<any>;
	public loading$: Observable<boolean>;

	constructor(
		private webhookService: WebhookService,
		private webhookQuery: WebhookQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.webhooks$ = this.webhookQuery.selectAll();
		this.loading$ = this.webhookQuery.selectLoading();

		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.fetchContent();

	}

	public fetchContent() {
		this.webhookService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
