import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ContentTypeService, } from '../../store';
import { ContentTypeFieldQuery } from '~lib/store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public contentFields: any[];
	public workflows = [];
	public openFields = {};
	public contentTypeValues: any;

	constructor(
		private contentTypeService: ContentTypeService,
		private contentTypeFieldQuery: ContentTypeFieldQuery,
		private router: Router,
		private toastr: ToastrService
	) { }

	public ngOnInit(): void {
		this.contentTypeFieldQuery.results$
			.pipe(
				takeUntil(this.componentDestroyed$)
			)
			.subscribe((contentFields) => this.contentFields = contentFields);
	}

	public handleContentTypeChange(values) {
		this.contentTypeValues = values;
	}

	public submit(e: Event) {
		e.preventDefault();
		this.contentTypeService.create(this.contentTypeValues)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('ContentType created', 'Success');
				this.router.navigate(['/content/content-types', result.uuid]);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
