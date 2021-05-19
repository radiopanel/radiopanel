import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject, Observable } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import slugify from 'slugify';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTypeQuery, PageTypeService, PageService } from '../../store';
import { InputMode } from '~lib/shared.types';

@Component({
	templateUrl: './page-detail.page.html'
})
export class PageDetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public inputMode = InputMode;
	public mode: InputMode = InputMode.EDIT;
	public form: FormGroup;
	public pageType: any;
	public page: any;

	constructor(
		private formQuery: PageTypeQuery,
		private formService: PageTypeService,
		private pageService: PageService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.fetch();

		this.activatedRoute.params.pipe(takeUntil(this.componentDestroyed$)).subscribe(() => {
			this.fetch();
		});
	}

	public fetch() {
		this.formService.fetchOne(this.activatedRoute.snapshot.params.pageTypeUuid).pipe(first()).subscribe();
		combineLatest(
			this.pageService.fetchOne(this.activatedRoute.snapshot.params.pageTypeUuid),
			this.formQuery.selectEntity(this.activatedRoute.snapshot.params.pageTypeUuid)
		)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe(([page, pageType]) => {
				this.pageType = pageType;
				this.page = page;

				if (!pageType) {
					return;
				}

				const fields = pageType.fields.reduce((acc, field) => ({
					...acc,
					[field.slug]: ['']
				}), {});

				this.form = this.formBuilder.group({
					name: ['', Validators.required],
					slug: ['', Validators.required],
					fields: this.formBuilder.group(fields)
				});

				this.form.patchValue(page);
			});
	}

	public toggleMode(newMode: InputMode): void {
		this.mode = newMode;

		if (newMode === InputMode.EDIT) {
			this.form.patchValue(this.page);
		}
	}

	public submit(e: Event, action: string) {
		e.preventDefault();
		this.pageService.update(
			this.activatedRoute.snapshot.params.pageTypeUuid,
			this.activatedRoute.snapshot.params.pageUuid,
			this.form.value,
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Page updated', 'Success');
				this.mode = InputMode.EDIT;
				this.fetch();
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
