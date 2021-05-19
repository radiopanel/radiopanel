import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormService, FormFieldService, FormFieldQuery } from '../../store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public contentFields: any[];
	public workflows = [];
	public openFields = {};
	public formValues: any;

	constructor(
		private formService: FormService,
		private formFieldQuery: FormFieldQuery,
		private formFieldService: FormFieldService,
		private router: Router,
		private toastr: ToastrService
	) { }

	public ngOnInit(): void {
		this.formFieldService.fetchContentFields()
			.pipe(first()).subscribe();
		this.formFieldQuery.results$
			.pipe(
				takeUntil(this.componentDestroyed$)
			)
			.subscribe((contentFields) => this.contentFields = contentFields);
	}

	public handleFormChange(values) {
		this.formValues = values;
	}

	public submit(e: Event) {
		e.preventDefault();
		this.formService.create(this.formValues)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Form created', 'Success');
				this.router.navigate(['/forms', result.uuid]);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
