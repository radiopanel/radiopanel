import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, first, debounceTime } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentTypeQuery, ContentQuery, ContentService, ContentTypeService } from '../../store';
import { FormControl } from '@angular/forms';
import { getColumns } from './content-list.const';
import { convertTableSortingToShorthand } from '~lib/ui/utils';

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
	public columns = getColumns();
	public sorting = {
		key: 'name',
		order: 'asc',
	};

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
				this.fetchContent();
			});

		this.contentTypeService.fetchOne(this.activatedRoute.snapshot.params.contentTypeUuid)
			.pipe(first())
			.subscribe((contentType) => {
				this.columns = getColumns(contentType.fields);
			});
		this.fetchContent();
	}

	public onOrderBy(order) {
		this.sorting = order;
		this.fetchContent();
	}

	public fetchContent() {
		this.contentType$ = this.contentTypeQuery.selectEntity(this.activatedRoute.snapshot.params.contentTypeUuid);
		this.contentService.fetch(
			this.activatedRoute.snapshot.params.contentTypeUuid,
			this.pagination,
			this.search.value,
			convertTableSortingToShorthand(this.sorting)
		)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public onPageUpdate(pagination) {
		this.pagination = pagination;
		this.fetchContent();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
