import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SongHistoryService, SongHistoryQuery } from '../../store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public history$: Observable<any>;
	public pagination$: Observable<any>;
	public currentPage = 1;

	constructor(
		private songHistoryService: SongHistoryService,
		private songHistoryQuery: SongHistoryQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.history$ = this.songHistoryQuery.selectAll();
		this.pagination$ = this.songHistoryQuery.pagination$;

		this.fetchContent();
	}

	public onPageUpdate(pagination) {
		this.songHistoryService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public fetchContent() {
		this.songHistoryService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
