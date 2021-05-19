import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TenantService } from '../../../../store';
import { SessionQuery } from '~lib/store';

@Component({
	templateUrl: './stream.page.html'
})
export class StreamPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType: any;
	public tenantUuid: string;

	constructor(
		private tenantService: TenantService,
		private formBuilder: FormBuilder,
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
			name: ['', Validators.required],
			settings: this.formBuilder.group({
				configurationType: ['manual', Validators.required],
				streamUrl: ['', Validators.required],
				streamType: ['', Validators.required],
				azuraCastApiKey: ['', Validators.required],
				azuraCastBaseUrl: ['', Validators.required],
				azuraCastStationId: ['', Validators.required],
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
