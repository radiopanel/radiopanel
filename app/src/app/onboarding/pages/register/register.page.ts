import { ToastrService } from 'ngx-toastr';
import { prop } from 'ramda';
import { Subject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../../../core/services';
import { InviteService, InviteQuery } from '../../store';

@Component({
	templateUrl: './register.page.html'
})
export class RegisterPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public resources$;
	public folder: string[] = [];
	public form: FormGroup;
	public loading$: Observable<boolean>;
	public invite: any;
	public loading = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private authService: AuthService,
		private toastr: ToastrService,
		private jwtHelper: JwtHelperService,
		private router: Router,
		private inviteQuery: InviteQuery,
		private inviteService: InviteService
	) { }

	public ngOnInit(): void {
		this.loading$ = this.inviteQuery.selectLoading();

		this.inviteService.findOne(this.route.snapshot.params.inviteUuid)
			.pipe(first())
			.subscribe((invite) => {
				this.form = this.formBuilder.group({
					username: [invite.username, Validators.required],
					email: [invite.emailAddress, Validators.required],
					password: ['', Validators.required]
				});

				this.invite = invite;
			});
	}

	public async handleSubmit(e: Event) {
		e.preventDefault();
		if (this.loading) {
			return;
		}

		this.loading = true;
		await this.inviteService.register(this.route.snapshot.params.inviteUuid, this.form.value).toPromise();
		this.loading = false;
		this.authService.login(this.form.getRawValue())
			.pipe(
				first()
			)
			.subscribe(({ username }) => {
				this.toastr.success(`Welcome back ${username}`, 'Success');
				this.router.navigate(['/']);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
