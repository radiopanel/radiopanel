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
	templateUrl: './socials.page.html'
})
export class SocialsPageComponent implements OnInit, OnDestroy {
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
			socials: this.formBuilder.group({
				facebook: [''],
				twitter: [''],
				discord: [''],
				instagram: [''],
				youtube: [''],
				twitch: [''],
			})
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
