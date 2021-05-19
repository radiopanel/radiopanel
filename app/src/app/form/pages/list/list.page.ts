import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { FormQuery, FormService } from '../../store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public forms$: Observable<any>;
	public loading$: Observable<boolean>;
	public pagination$: Observable<any>;

	constructor(
		private formService: FormService,
		private formQuery: FormQuery
	) { }

	public ngOnInit(): void {
		this.pagination$ = this.formQuery.select('pagination');
		this.loading$ = this.formQuery.selectLoading();
		this.forms$ = this.formQuery.selectAll();
		this.formService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}


	public onPageUpdate(pagination) {
		this.formService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
