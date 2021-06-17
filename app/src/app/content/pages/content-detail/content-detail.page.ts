import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject, Observable } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import slugify from 'slugify';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentTypeQuery, ContentTypeService, ContentService } from '../../store';
import { InputMode } from '~lib/shared.types';

@Component({
	templateUrl: './content-detail.page.html'
})
export class ContentDetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public inputMode = InputMode;
	public mode: InputMode = InputMode.EDIT;
	public form: FormGroup;
	public contentType: any;
	public content: any;
	public activeTab = 'meta';

	constructor(
		private formQuery: ContentTypeQuery,
		private formService: ContentTypeService,
		private contentService: ContentService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.fetch();
	}

	public setActiveTab(e: Event, tab: string) {
		e.preventDefault();

		this.activeTab = tab;
	}

	public fetch() {
		this.formService.fetchOne(this.activatedRoute.snapshot.params.contentTypeUuid).pipe(first()).subscribe();
		combineLatest(
			this.contentService.fetchOne(
				this.activatedRoute.snapshot.params.contentTypeUuid,
				this.activatedRoute.snapshot.params.contentUuid
			),
			this.formQuery.selectEntity(this.activatedRoute.snapshot.params.contentTypeUuid)
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
					publishScheduledAt: [null],
					unPublishScheduledAt: [null],
					published: [false],
					fields: this.formBuilder.group(fields)
				});

				this.form.patchValue(content);
			});
	}

	public toggleMode(newMode: InputMode): void {
		this.mode = newMode;

		if (newMode === InputMode.EDIT) {
			this.form.patchValue(this.content);
		}
	}

	public submit(e: Event, action: string) {
		e.preventDefault();
		this.contentService.update(
			this.activatedRoute.snapshot.params.contentTypeUuid,
			this.activatedRoute.snapshot.params.contentUuid,
			this.form.value,
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Content updated', 'Success');
				this.mode = InputMode.EDIT;
				this.fetch();
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.contentService.delete(
			this.activatedRoute.snapshot.params.contentTypeUuid,
			this.activatedRoute.snapshot.params.contentUuid
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Content deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
