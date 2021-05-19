import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, first, skip } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RulePageService, RulePageQuery } from '../../store';
import { FormControl } from '@angular/forms';

@Component({
	templateUrl: './view.page.html'
})
export class ViewPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public rulePages$: Observable<any>;
	public pagination$: Observable<any>;
	public loading$: Observable<boolean>;
	public search = new FormControl('');
	public pagination: any = {};
	public currentPage = 1;
	public activeTab = 0;

	constructor(
		private rulePageService: RulePageService,
		private rulePageQuery: RulePageQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.rulePages$ = this.rulePageQuery.selectAll();
		this.loading$ = this.rulePageQuery.selectLoading();
		this.pagination$ = this.rulePageQuery.pagination$;

		this.search.valueChanges
			.pipe(
				skip(1),
				debounceTime(300),
				takeUntil(this.componentDestroyed$)
			).subscribe((value) => {
				this.rulePageService.fetch(value, this.pagination)
					.pipe(first()).subscribe();
			});

		this.fetchContent();
	}

	public setActiveTab(e: Event, index: number): void {
		e.preventDefault();
		this.activeTab = index;
	}

	public fetchContent() {
		this.rulePageService.fetch(null, { page: 1, pagesize: 100 })
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
