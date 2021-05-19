import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, combineLatest } from 'rxjs';
import { first, takeUntil, tap, debounceTime, map, skip } from 'rxjs/operators';
import * as uuid from 'uuid';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PermissionQuery, PermissionService, SessionQuery } from '~lib/store';
import { ApiKeyService } from '../../store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public toggleAllForm = new FormControl(false);
	public searchForm = new FormControl(null);
	public features$: Observable<any>;
	public permissions$: Observable<any>;
	public tenant$: Observable<any>;

	constructor(
		private apiKeyService: ApiKeyService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private sessionQuery: SessionQuery,
		private permissionService: PermissionService,
		private permissionQuery: PermissionQuery,
	) { }

	public generateKey(e: Event): void {
		e.preventDefault();

		this.form.patchValue({
			key: uuid.v4()
		});
	}

	public ngOnInit(): void {
		this.tenant$ = this.sessionQuery.tenant$;

		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			key: ['', Validators.required],
			permissions: [],
		});
	}

	public generateHeader(): string {
		return btoa(`${this.form.get('key').value}:`);
	}

	public submit(e: Event) {
		e.preventDefault();

		this.apiKeyService.create(this.form.value)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Api key created', 'Success');
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
