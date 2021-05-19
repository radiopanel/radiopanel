import { ToastrService } from 'ngx-toastr';
import { prop } from 'ramda';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../../../core/services';

@Component({
	templateUrl: './request-password-reset.page.html'
})
export class RequestPasswordResetPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public resources$;
	public folder: string[] = [];
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private toastr: ToastrService,
		private jwtHelper: JwtHelperService,
		private router: Router,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			emailAddress: ['', Validators.required],
		});
	}

	public handleSubmit(e: Event) {
		e.preventDefault();

		this.authService.requestPasswordReset(this.form.value)
			.pipe(
				first()
			)
			.subscribe(() => {
				this.toastr.success(`A mail has been send`, 'Success');
				this.router.navigate(['/auth/login']);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
