import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FormService, FormFieldService } from '../../store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public formValues: any;
	public contentFields: any[];
	public contentType: any;
	public workflows = [];
	public openFields = {};

	constructor(
		private formService: FormService,
		private formFieldService: FormFieldService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.formFieldService.fetchContentFields()
			.pipe(
				first()
			).subscribe((contentFields) => {
				this.contentFields = contentFields as any;
				this.formService.fetchOne(this.activatedRoute.snapshot.params.id)
					.pipe(
						first()
					).subscribe((contentType) => {
						this.formValues = contentType;
						this.contentType = contentType;
					});
			});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.formService.update(this.activatedRoute.snapshot.params.id, this.formValues)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Form updated', 'Success');
			});
	}

	public handleFormChange(values) {
		this.formValues = values;
	}

	public delete(e: Event) {
		e.preventDefault();
		this.formService.delete(this.activatedRoute.snapshot.params.id)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.warning('Form deleted', 'Success');
				this.router.navigate(['/forms']);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
