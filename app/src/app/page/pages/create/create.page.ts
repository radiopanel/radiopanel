import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContentTypeFieldQuery } from '~lib/store';

import { PageTypeService } from '../../store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public pageFields: any[];
	public workflows = [];
	public openFields = {};
	public pageTypeValues: any;

	constructor(
		private pageTypeService: PageTypeService,
		private contentTypeFieldQuery: ContentTypeFieldQuery,
		private router: Router,
		private toastr: ToastrService
	) { }

	public ngOnInit(): void {
		this.contentTypeFieldQuery.results$
			.pipe(
				takeUntil(this.componentDestroyed$)
			)
			.subscribe((pageFields) => this.pageFields = pageFields);
	}

	public handlePageTypeChange(values) {
		this.pageTypeValues = values;
	}

	public submit(e: Event) {
		e.preventDefault();
		this.pageTypeService.create(this.pageTypeValues)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Page Type created', 'Success');
				this.router.navigate(['/pages/page-types', result.uuid]);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
