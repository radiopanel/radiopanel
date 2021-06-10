import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject, Observable } from 'rxjs';
import { first, takeUntil, tap, debounceTime, map } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../store';
import { HttpClient } from '@angular/common/http';
import { SessionQuery, PermissionQuery, PermissionService } from '~lib/store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public user: any;
	public tenant$: Observable<any>;
	public permissions$: Observable<any>;
	public features$: Observable<any>;
	public loading = false;
	public searchForm = new FormControl(null);

	constructor(
		private userService: UserService,
		private sessionQuery: SessionQuery,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private http: HttpClient,
	) { }

	public ngOnInit(): void {
		this.tenant$ = this.sessionQuery.tenant$
			.pipe(
				tap((tenant) => {
					this.form.addControl('customData', this.formBuilder.group((tenant.profileFields || []).reduce((acc, field) => ({
						...acc,
						[field.slug]: ['']
					}), {})));
					this.form.patchValue({ customData: this.user.customData || {} });
				})
			);

		this.fetch();
	}

	public fetch(): void {
		this.userService.fetchOne(this.activatedRoute.snapshot.params.id)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((user) => {
				this.user = user;
				this.loading = false;

				this.form = this.formBuilder.group({
					username: ['', Validators.required],
					email: ['', Validators.required],
					avatar: ['', Validators.required],
					bio: ['', Validators.required],
					roles: [[], Validators.required],
					socials: this.formBuilder.group({
						facebook: [''],
						twitter: [''],
						discord: [''],
						instagram: [''],
						youtube: [''],
						twitch: [''],
					}),
					permissions: [],
				});

				this.form.patchValue({
					...user,
					roles: (user.roles || []).map((role) => role.uuid),
				});
			});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.userService.update(
			this.activatedRoute.snapshot.params.id,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('User updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.userService.delete(
			this.activatedRoute.snapshot.params.id
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('User removed from tenant', 'Success');
			});
	}

	public findAzuraMeta(): any {
		return (this.user.meta || []).find((meta) => meta.type === 'azuraAccount');
	}

	public createAzuraCastAccount(): void {
		this.loading = true;
		this.http.post('/api/v1/azuracast-users', {}, {
			params: {
				userUuid: this.activatedRoute.snapshot.params.id
			}
		})
			.pipe(first())
			.subscribe(() => {
				this.fetch();
			});
	}

	public deleteAzuraCastAccount(azuraId: string): void {
		this.loading = true;
		this.http.delete(`/api/v1/azuracast-users/${azuraId}`, {
			params: {
				userUuid: this.activatedRoute.snapshot.params.id
			}
		})
			.pipe(first())
			.subscribe(() => {
				this.fetch();
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
