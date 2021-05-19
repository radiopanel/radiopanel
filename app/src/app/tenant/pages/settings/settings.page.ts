import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { TenantService } from '../../store';
import { SessionQuery } from '~lib/store';

@Component({
	templateUrl: './settings.page.html'
})
export class SettingsPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType: any;
	public tenantUuid: string;

	constructor(
		private TenantService: TenantService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private sessionQuery: SessionQuery,
		private toastr: ToastrService,
	) { }

	private fetch(tenantUuid: string): void {
		this.TenantService.fetchOne(tenantUuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.form.patchValue(values);
			});
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			settings: this.formBuilder.group({
				streamUrl: ['', Validators.required],
				streamType: ['', Validators.required],
				streamConnectionIp: ['', Validators.required],
				streamConnectionPort: ['', Validators.required],
				spotifyClientId: ['', Validators.required],
				spotifyClientSecret: ['', Validators.required],
				matchingService: ['spotify', Validators.required],
				azuraCastIntegrationEnabled: [false, Validators.required],
				azuraCastApiKey: ['', Validators.required],
				azuraCastBaseUrl: ['', Validators.required],
				azuraCastStationId: ['', Validators.required],
				logo: ['', Validators.required],
				minimumSlotDuration: [30, Validators.required],
				requestTimeout: [15, Validators.required],
				maximumSlotDuration: [1440, Validators.required],
				primaryColor: ['', Validators.required],
				patreonAccessToken: ['', Validators.required],
				dashboardText: [''],
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
		this.TenantService.update(
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
