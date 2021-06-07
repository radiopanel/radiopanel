import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationMethodService } from '../../store';
import { authMethodConfig } from './detail.const';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public authenticationConfigFields: any[] = [];
	public form: FormGroup;
	public authenticationMethod: any;

	constructor(
		private authenticationMethodService: AuthenticationMethodService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {

		this.authenticationMethodService.fetchOne(this.activatedRoute.snapshot.params.id)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.authenticationMethod = values;
				this.createForm(values);
			});
	}

	public getCallbackUrl(): string {
		return `${window.location.protocol}//${window.location.host}/api/v1/auth/login/${this.authenticationMethod?.uuid}`;
	}

	private createForm(values: any): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			type: ['', Validators.required],
			weight: [0, Validators.required],
			defaultRoleUuid: ['', Validators.required],
			enabled: [true, Validators.required],
			config: this.formBuilder.group({})
		});

		this.createConfigForm(values.type);

		this.form.patchValue(values);
	}

	private createConfigForm(authMethodType: string): void {
		this.authenticationConfigFields = authMethodConfig[authMethodType];
		const config = authMethodConfig[authMethodType].reduce((acc, fieldConfig) => ({
			...acc,
			[fieldConfig.slug]: ['']
		}), {});

		this.form.setControl('config', this.formBuilder.group(config));
	}

	public submit(e: Event) {
		e.preventDefault();

		this.authenticationMethodService.update(
			this.activatedRoute.snapshot.params.id,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Authentication method updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.authenticationMethodService.delete(
			this.activatedRoute.snapshot.params.id
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Authentication method deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
