import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, combineLatest } from 'rxjs';
import { first, takeUntil, tap, debounceTime, map, skip } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PermissionQuery, PermissionService, RoleService, SessionQuery } from '~lib/store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;

	constructor(
		private roleService: RoleService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			weight: [0, Validators.required],
			permissions: []
		});
	}

	public submit(e: Event) {
		e.preventDefault();

		this.roleService.create(this.form.value)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Role created', 'Success');
				this.router.navigate(['../', result.uuid], {
					relativeTo: this.activatedRoute
				});
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
