import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { BannerService, BannerQuery } from '../../store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public banners$: Observable<any>;
	public loading$: Observable<boolean>;
	public pagination$: Observable<any>;

	constructor(
		private bannerService: BannerService,
		private bannerQuery: BannerQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.pagination$ = this.bannerQuery.select('pagination');
		this.banners$ = this.bannerQuery.selectAll();
		this.loading$ = this.bannerQuery.selectLoading();

		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.fetchContent();

	}

	public fetchContent() {
		this.bannerService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public onPageUpdate(pagination) {
		this.bannerService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
