import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { PageTypeQuery, PageTypeService } from '../../store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();
	public pageTypes$;
	public loading$: Observable<boolean>;

	constructor(
		private pageTypeService: PageTypeService,
		private pageTypeQuery: PageTypeQuery
	) { }

	public ngOnInit(): void {
		this.loading$ = this.pageTypeQuery.selectLoading();
		this.pageTypes$ = this.pageTypeQuery.selectAll();
		this.pageTypeService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
