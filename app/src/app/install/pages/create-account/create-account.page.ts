import { ToastrService } from 'ngx-toastr';
import { prop } from 'ramda';
import { Subject } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services';

@Component({
	templateUrl: './create-account.page.html'
})
export class CreateAccountPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public resources$;
	public folder: string[] = [];
	public form: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private toastr: ToastrService,
		private router: Router,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			username: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(5)]]
		});
	}

	public async handleSubmit(e: Event) {
		e.preventDefault();

		this.form.markAllAsTouched();
		if (this.form.invalid) {
			return;
		}

		localStorage.removeItem('token');
		localStorage.removeItem('AkitaStores');
		localStorage.removeItem('selectedTenant');

		this.authService.register(this.form.value)
			.pipe(
				first()
			)
			.subscribe(() => {
				this.toastr.success(`Account created successfully`, 'Success');
				this.router.navigate(['/', 'install', 'create-station']);
			});
	}


	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
