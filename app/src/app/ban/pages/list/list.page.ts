import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, first, skip } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormControl } from '@angular/forms';
import { BanService, BanQuery } from '../../../../lib/store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public bans$: Observable<any>;
	public pagination$: Observable<any>;
	public loading$: Observable<boolean>;
	public search = new FormControl('');
	public pagination: any = {};
	public currentPage = 1;

	constructor(
		private banService: BanService,
		private banQuery: BanQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.bans$ = this.banQuery.selectAll();
		this.loading$ = this.banQuery.selectLoading();
		this.pagination$ = this.banQuery.select('pagination');

		this.search.valueChanges
			.pipe(
				skip(1),
				debounceTime(300),
				takeUntil(this.componentDestroyed$)
			).subscribe((value) => {
				this.banService.fetch(value, this.pagination)
					.pipe(first()).subscribe();
			});

		this.fetchContent();
	}

	public onPageUpdate(pagination) {
		this.pagination = pagination;
		this.banService.fetch('', pagination)
			.pipe(first()).subscribe();
	}

	public fetchContent() {
		this.banService.fetch(null)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
