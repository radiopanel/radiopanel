import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, first, debounceTime } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentTypeQuery, ContentQuery, ContentService, ContentTypeService } from '../../store';
import { FormControl } from '@angular/forms';

@Component({
	templateUrl: './content-list.page.html'
})
export class ContentListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();
	private pagination: any;

	public content$: Observable<any>;
	public loading$: Observable<boolean>;
	public contentType$: Observable<any>;
	public pagination$: Observable<any>;
	public search = new FormControl('');

	constructor(
		private contentService: ContentService,
		private contentQuery: ContentQuery,
		private contentTypeService: ContentTypeService,
		private contentTypeQuery: ContentTypeQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.content$ = this.contentQuery.selectAll();
		this.pagination$ = this.contentQuery.select('pagination');
		this.loading$ = this.contentQuery.selectLoading();
		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.search.valueChanges
			.pipe(
				debounceTime(300),
				takeUntil(this.componentDestroyed$)
			).subscribe((value) => {
				this.contentService.fetch(this.activatedRoute.snapshot.params.contentTypeUuid, this.pagination, value)
					.pipe(
						first()
					).subscribe();
			});

		this.fetchContent();
	}

	public fetchContent() {
		this.contentType$ = this.contentTypeQuery.selectEntity(this.activatedRoute.snapshot.params.contentTypeUuid);
		this.contentTypeService.fetchOne(this.activatedRoute.snapshot.params.contentTypeUuid).pipe(first()).subscribe();
		this.contentService.fetch(this.activatedRoute.snapshot.params.contentTypeUuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public onPageUpdate(pagination) {
		this.pagination = pagination;
		this.contentService.fetch(this.activatedRoute.snapshot.params.contentTypeUuid, pagination, this.search.value)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
