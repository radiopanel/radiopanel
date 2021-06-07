import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Observable, Subject } from 'rxjs';
import { first, takeUntil, tap, skip, map, debounceTime } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PermissionQuery, PermissionService, RoleService, SessionQuery } from '~lib/store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public role: any;

	constructor(
		private roleService: RoleService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.roleService.fetchOne(this.activatedRoute.snapshot.params.id)
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
			weight: [0, Validators.required],
			permissions: []
		});

		this.form.patchValue(this.role);
	}

	public submit(e: Event) {
		e.preventDefault();
		this.roleService.update(
			this.activatedRoute.snapshot.params.id,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Role updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.roleService.delete(
			this.activatedRoute.snapshot.params.id
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Role deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
