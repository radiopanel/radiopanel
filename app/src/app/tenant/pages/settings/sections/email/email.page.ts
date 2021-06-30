import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TenantService } from '../../../../store';
import { SessionQuery } from '~lib/store';

@Component({
	templateUrl: './email.page.html'
})
export class EmailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType: any;
	public tenantUuid: string;

	constructor(
		private tenantService: TenantService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private sessionQuery: SessionQuery,
		private toastr: ToastrService,
	) { }

	private fetch(tenantUuid: string): void {
		this.tenantService.fetchOne(tenantUuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.form.patchValue(values);
			});
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			settings: this.formBuilder.group({
				emailBackgroundColor: ['#181818', Validators.required],
				emailBoxBackgroundColor: ['#292929', Validators.required],
				emailPrimaryColor: ['#FF926B', Validators.required],
				emailSecondaryColor: ['#E86856', Validators.required],
				emailTitleTextColor: ['#FFFFFF', Validators.required],
				emailButtonTextColor: ['#FFFFFF', Validators.required],
				emailTextColor: ['#e6e6e6', Validators.required],
				emailFooterTextColor: ['#616161', Validators.required],
				emailLogo: ['/assets/img/logo-monochrome-light.png', Validators.required],
				emailFrom: ['"RadioPanel" <info@radiopanel.co>', Validators.required]
			}),
		});

		this.sessionQuery.select()
			.pipe(
				first()
			)
			.subscribe(({ tenant }) => {
				this.tenantUuid = tenant.uuid;
				this.fetch(tenant.uuid);
			});
	}

	public submit(e: Event) {
		this.tenantService.update(
			this.tenantUuid,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Settings updated', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
