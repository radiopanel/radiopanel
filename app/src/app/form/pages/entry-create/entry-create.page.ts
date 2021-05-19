import { ToastrService } from 'ngx-toastr';
import { Subject, Observable } from 'rxjs';
import { pathOr } from 'ramda';
import { first, takeUntil, tap } from 'rxjs/operators';
import slugify from 'slugify';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { path } from 'ramda';
import { FormEntryService, FormQuery, FormService } from '../../store';

@Component({
	templateUrl: './entry-create.page.html'
})
export class EntryCreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public language: string;
	public form: FormGroup;
	public form$: any;
	public languages$: Observable<any[]>;

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
		this.formService.fetchOne(this.activatedRoute.snapshot.params.formUuid)
			.pipe(
				first()
			).subscribe();
		this.form$ = this.formQuery.selectEntity(this.activatedRoute.snapshot.params.formUuid)
			.pipe(
				tap((form) => {
					if (!form) {
						return;
					}

					const fields = form.fields.reduce((acc, field) => ({
						...acc,
						[field.slug]: ['']
					}), {});

					this.form = this.formBuilder.group({
						name: ['', Validators.required],
						slug: ['', Validators.required],
						state: [path(['workflow', 'initial'])(form), Validators.required],
						fields: this.formBuilder.group(fields)
					});

					this.form.get('name').valueChanges
						.pipe(
							takeUntil(this.componentDestroyed$)
						).subscribe((value) => this.form.patchValue({
							slug: slugify(value).toLowerCase()
						}));
				})
			);
	}

	public submit(e: Event) {
		e.preventDefault();
		this.formEntryService.create(this.activatedRoute.snapshot.params.formUuid, this.form.value)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Entry created', 'Success');
				this.router.navigate(['../', result.uuid], {
					relativeTo: this.activatedRoute
				});
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
