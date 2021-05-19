import { ToastrService } from 'ngx-toastr';
import { prop } from 'ramda';
import { Subject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { PasswordResetQuery, PasswordResetService } from '../../store';

@Component({
	templateUrl: './password-reset.page.html'
})
export class PasswordResetPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public resources$;
	public folder: string[] = [];
	public form: FormGroup;
	public loading$: Observable<boolean>;
	public invite: any;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private passwordResetquery: PasswordResetQuery,
		private passwordResetService: PasswordResetService
	) { }

	public ngOnInit(): void {
		this.loading$ = this.passwordResetquery.selectLoading();

		this.passwordResetService.findOne(this.route.snapshot.params.passwordResetUuid)
			.pipe(first())
			.subscribe((invite) => {
				this.form = this.formBuilder.group({
					emailAddress: [invite.emailAddress],
					password: ['', Validators.required]
				});

				this.invite = invite;
			});
	}

	public async handleSubmit(e: Event) {
		e.preventDefault();

		await this.passwordResetService.reset(this.route.snapshot.params.passwordResetUuid, this.form.value).toPromise();
		this.toastr.success('Your password has been reset', 'Success');
		this.router.navigate(['/auth/login']);
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
