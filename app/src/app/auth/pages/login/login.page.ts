import { ToastrService } from 'ngx-toastr';
import { prop } from 'ramda';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { AuthService } from '../../../core/services';
import { HttpClient } from '@angular/common/http';

@Component({
	templateUrl: './login.page.html'
})
export class LoginPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public resources$;
	public folder: string[] = [];
	public form: FormGroup;
	public customisationLoading = true;
	public customisation = null;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private toastr: ToastrService,
		private jwtHelper: JwtHelperService,
		private router: Router,
		private http: HttpClient,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			email: ['', Validators.required],
			password: ['', Validators.required]
		});

		this.loadCustomisation();
	}

	// TODO: move this to a generic service
	public async loadCustomisation(): Promise<void> {
		this.http.get('/api/v1/tenants/customisation')
			.pipe(first())
			.subscribe((result: any) => {
				if (!result) {
					return this.router.navigate(['/', 'install'])
				}

				// TODO: Fix this less ugly
				this.customisation = {
					...result,
					authBackground: result.authBackground || 'https://images.unsplash.com/photo-1500702790369-fe461685b3c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80'
				};
				this.customisationLoading = false;

				document.documentElement.style.setProperty('--color-primary', result?.primaryColor || '#FF926B');
			});
	}

	public handleSubmit(e: Event) {
		e.preventDefault();

		this.authService.login(this.form.value)
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
