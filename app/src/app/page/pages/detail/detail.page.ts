import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageTypeService } from '../../store';
import { ContentTypeFieldService } from '~lib/store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public pageTypeValues: any;
	public pageFields: any[];
	public pageType: any;
	public workflows = [];
	public openFields = {};

	constructor(
		private pageTypeService: PageTypeService,
		private contentTypeFieldService: ContentTypeFieldService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.contentTypeFieldService.fetchContentFields()
			.pipe(
				first()
			).subscribe((pageFields) => {
				this.pageFields = pageFields as any;
				this.pageTypeService.fetchOne(this.activatedRoute.snapshot.params.id)
					.pipe(
						first()
					).subscribe((pageType) => {
						this.pageTypeValues = pageType;
						this.pageType = pageType;
					});
			});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.pageTypeService.update(this.activatedRoute.snapshot.params.id, this.pageTypeValues)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('PageType updated', 'Success');
			});
	}

	public handlePageTypeChange(values) {
		this.pageTypeValues = values;
	}

	public delete(e: Event) {
		e.preventDefault();
		this.pageTypeService.delete(this.activatedRoute.snapshot.params.id)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.warning('Page type deleted', 'Success');
				this.router.navigate(['/pages/page-types']);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
