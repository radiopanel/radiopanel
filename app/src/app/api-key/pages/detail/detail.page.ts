import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiKeyService } from '../../store';
import { omit } from 'ramda';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public apiKeyFieldDisabled = true;
	public apiKeyFieldType = 'password';
	public role: any;

	constructor(
		private apiKeyService: ApiKeyService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public generateKey(e: Event): void {
		e.preventDefault();

		this.form.patchValue({
			key: uuid.v4()
		});

		this.apiKeyFieldDisabled = false;
		this.apiKeyFieldType = 'text';
	}

	public ngOnInit(): void {
		this.apiKeyService.fetchOne(this.activatedRoute.snapshot.params.id)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((role) => {
				this.role = {
					...role,
					permissions: role.permissions.reduce((acc, permission) => ({
						...acc,
						[permission.permission]: true,
					}), {})
				};

				this.buildForm();
			});
	}

	public buildForm() {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			key: ['', Validators.required],
			permissions: [],
		});
		this.form.patchValue(this.role);
	}

	public generateHeader(): string {
		return btoa(`${this.form.get('key').value}:`);
	}

	public submit(e: Event) {
		e.preventDefault();
		this.apiKeyService.update(
			this.activatedRoute.snapshot.params.id,
			this.apiKeyFieldDisabled ? omit(['key'])(this.form.value) : this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Api key updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.apiKeyService.delete(
			this.activatedRoute.snapshot.params.id
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Api key deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
