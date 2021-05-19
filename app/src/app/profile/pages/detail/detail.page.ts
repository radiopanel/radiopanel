import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProfileService } from '../../store';
import { SessionQuery } from '~lib/store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public user: any;
	public tenant$: any;

	constructor(
		private profileService: ProfileService,
		private formBuilder: FormBuilder,
		private sessionQuery: SessionQuery,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			username: ['', Validators.required],
			avatar: ['', Validators.required],
			bio: ['', Validators.required],
			socials: this.formBuilder.group({
				facebook: [''],
				twitter: [''],
				discord: [''],
				instagram: [''],
				youtube: [''],
				twitch: [''],
			}),
		});

		this.tenant$ = this.sessionQuery.tenant$
			.pipe(
				tap((tenant) => {
					this.form.addControl('customData', this.formBuilder.group((tenant.profileFields || []).reduce((acc, field) => ({
						...acc,
						[field.slug]: ['']
					}), {})));
				})
			);

		this.profileService.fetchOne()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.user = values;
				this.form.patchValue(values);
			});
	}

	public submit(e: Event) {
		e.preventDefault();

		this.profileService.update(this.form.value)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Profile updated', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
