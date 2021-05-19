import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject, Observable } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import slugify from 'slugify';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormQuery, FormFieldService, FormService, FormEntryService } from '../../store';
import { InputMode } from '~lib/shared.types';

@Component({
	templateUrl: './entry-detail.page.html'
})
export class EntryDetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public inputMode = InputMode;
	public mode: InputMode = InputMode.VIEW;
	public form: FormGroup;
	public contentType: any;
	public content: any;

	constructor(
		private formQuery: FormQuery,
		private formService: FormService,
		private formEntryService: FormEntryService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.fetch();
	}

	public fetch() {
		this.formService.fetchOne(this.activatedRoute.snapshot.params.formUuid).pipe(first()).subscribe();
		combineLatest(
			this.formEntryService.fetchOne(
				this.activatedRoute.snapshot.params.formUuid,
				this.activatedRoute.snapshot.params.entryUuid
			),
			this.formQuery.selectEntity(this.activatedRoute.snapshot.params.formUuid)
		)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe(([content, contentType]) => {
				this.contentType = contentType;
				this.content = content;

				if (!contentType) {
					return;
				}

				const fields = contentType.fields.reduce((acc, field) => ({
					...acc,
					[field.slug]: ['']
				}), {});

				this.form = this.formBuilder.group({
					name: ['', Validators.required],
					slug: ['', Validators.required],
					fields: this.formBuilder.group(fields)
				});

				this.form.patchValue(content);
			});
	}

	public toggleMode(newMode: InputMode): void {
		this.mode = newMode;

		if (newMode === InputMode.VIEW) {
			this.form.patchValue(this.content);
		}
	}

	public submit(e: Event, action: string) {
		e.preventDefault();
		this.formEntryService.update(
			this.activatedRoute.snapshot.params.formUuid,
			this.activatedRoute.snapshot.params.entryUuid,
			this.form.value,
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Entry updated', 'Success');
				this.mode = InputMode.VIEW;
				this.fetch();
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.formEntryService.delete(
			this.activatedRoute.snapshot.params.formUuid,
			this.activatedRoute.snapshot.params.entryUuid
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Entry deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
