import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormQuery, FormEntryQuery, FormEntryService, FormService } from '../../store';

@Component({
	templateUrl: './entry-list.page.html'
})
export class EntryListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public content$: Observable<any>;
	public loading$: Observable<boolean>;
	public contentType$: Observable<any>;
	public pagination$: Observable<any>;

	constructor(
		private formEntryService: FormEntryService,
		private formEntryQuery: FormEntryQuery,
		private formService: FormService,
		private formQuery: FormQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.pagination$ = this.formEntryQuery.select('pagination');
		this.content$ = this.formEntryQuery.selectAll();
		this.loading$ = this.formEntryQuery.selectLoading();
		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.fetchContent();
	}

	public fetchContent() {
		this.contentType$ = this.formQuery.selectEntity(this.activatedRoute.snapshot.params.formUuid);
		this.formService.fetchOne(this.activatedRoute.snapshot.params.formUuid).pipe(first()).subscribe();
		this.formEntryService.fetch(this.activatedRoute.snapshot.params.formUuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public onPageUpdate(pagination) {
		this.formEntryService.fetch(this.activatedRoute.snapshot.params.formUuid, pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
