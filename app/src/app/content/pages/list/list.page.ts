import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { ContentTypeQuery, ContentTypeService } from '../../store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public contentTypes$;
	public loading$: Observable<boolean>;
	public pagination$: Observable<any>;

	constructor(
		private contentTypeService: ContentTypeService,
		private contentTypeQuery: ContentTypeQuery
	) { }

	public ngOnInit(): void {
		this.pagination$ = this.contentTypeQuery.select('pagination');
		this.loading$ = this.contentTypeQuery.selectLoading();
		this.contentTypes$ = this.contentTypeQuery.selectAll();
		this.contentTypeService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public onPageUpdate(pagination) {
		this.contentTypeService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
