import { ToastrService } from 'ngx-toastr';
import { isNil, pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { InstallService } from '../../store';
import { SessionQuery } from '~lib/store';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services';

@Component({
	templateUrl: './setup-station.page.html'
})
export class SetupStationPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public currentStep = 0;
	public form: FormGroup;
	public contentType: any;
	public tenantUuid: string;
	public streamConnectionSuccessful = false;
	public matchingServiceSuccessful = false;

	constructor(
		private installService: InstallService,
		private authService: AuthService,
		private formBuilder: FormBuilder,
		private router: Router,
		private sessionQuery: SessionQuery,
		private toastr: ToastrService,
		private http: HttpClient,
	) { }

	private fetch(tenantUuid: string): void {
		this.installService.fetchOne(tenantUuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => { 
				this.form.patchValue(values);
			});
	}

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			settings: this.formBuilder.group({
				configurationType: ['azura', Validators.required],
				streamUrl: ['', Validators.required],
				streamType: ['', Validators.required],
				azuraCastApiKey: ['', Validators.required],
				azuraCastBaseUrl: ['', Validators.required],
				azuraCastStationId: ['', Validators.required],
				matchingService: ['spotify'],
				spotifyClientId: [''],
				spotifyClientSecret: [''],
			}),
		});

		this.form.valueChanges.pipe(
			takeUntil(this.componentDestroyed$)
		).subscribe(() => this.streamConnectionSuccessful = false);

		this.sessionQuery.select()
			.pipe(
				filter((tenant) => !isNil(tenant)),
				distinctUntilChanged()
			)
			.subscribe(({ tenant }) => {
				this.tenantUuid = tenant.uuid;
				this.fetch(tenant.uuid);
			});
	}

	public testStream(e: Event) {
		this.http.post('/api/v1/songs/verify-connection', this.form.value)
			.pipe(
				first(),
			)
			.subscribe(({ songTitle }: { songTitle: string }) => {
				if (!songTitle) {
					this.streamConnectionSuccessful = false;
					return this.toastr.warning('No song is playing or connection failed', 'Something went wrong');
				}

				this.streamConnectionSuccessful = true;
				this.toastr.success(`Currently playing: ${songTitle}`, 'Success!');
			});
	}

	public testMatchingService(e: Event) {
		this.http.post('/api/v1/songs/verify-matching-service', this.form.value)
			.pipe(
				first(),
			)
			.subscribe(({ ok }: { ok: string }) => {
				if (!ok) {
					this.matchingServiceSuccessful = false;
					return this.toastr.warning('No song is playing or connection failed', 'Something went wrong');
				}

				this.matchingServiceSuccessful = true;
				this.toastr.success(`Matching service connected successfully`, 'Success!');
			});
	}

	public nextStep(e: Event) {
		this.installService.update(
			this.tenantUuid,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.currentStep += 1;

				if (this.currentStep === 2) {
					this.router.navigate(['/']);
					this.toastr.success(`Configuration finished`, 'Success!');
				}
			});
	}

	public skip(e: Event) {
		this.installService.update(
			this.tenantUuid,
			{ settings: { setupSkipped: true } }
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['/']);
				this.toastr.warning(`Configuration skipped`, 'Success!');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
