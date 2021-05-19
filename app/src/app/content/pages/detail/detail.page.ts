import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ContentTypeService } from '../../store';
import { ContentTypeFieldService } from '~lib/store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public contentTypeValues: any;
	public contentFields: any[];
	public contentType: any;
	public workflows = [];
	public openFields = {};

	constructor(
		private contentTypeService: ContentTypeService,
		private contentTypeFieldService: ContentTypeFieldService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.contentTypeFieldService.fetchContentFields()
			.pipe(
				first()
			).subscribe((contentFields) => {
				this.contentFields = contentFields as any;
				this.contentTypeService.fetchOne(this.activatedRoute.snapshot.params.id)
					.pipe(
						first()
					).subscribe((contentType) => {
						this.contentTypeValues = contentType;
						this.contentType = contentType;
					});
			});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.contentTypeService.update(this.activatedRoute.snapshot.params.id, this.contentTypeValues)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('ContentType updated', 'Success');
			});
	}

	public handleContentTypeChange(values) {
		this.contentTypeValues = values;
	}

	public delete(e: Event) {
		e.preventDefault();
		this.contentTypeService.delete(this.activatedRoute.snapshot.params.id)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.warning('ContentType deleted', 'Success');
				this.router.navigate(['/content/content-types']);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
