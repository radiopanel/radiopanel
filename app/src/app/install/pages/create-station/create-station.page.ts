import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import slugify from 'slugify';
import { AuthService } from '../../../core/services';
import { InstallService } from '../../store/install/install.service';

@Component({
	templateUrl: './create-station.page.html'
})
export class CreateStationPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType$: any;

	constructor(
		private installService: InstallService,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private router: Router,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			url: ['', Validators.required],
		});

		this.form.get('name').valueChanges.pipe(
			takeUntil(this.componentDestroyed$)
		).subscribe((value) => this.form.patchValue({
			slug: slugify(value).toLocaleLowerCase()
		}));
	}

	public submit(e: Event) {
		e.preventDefault();
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			return;
		}

		this.installService.create(this.form.value)
			.pipe(
				first()
			).subscribe(() => {
				this.authService.fetchSessionData();
				this.router.navigate(['/', 'install', 'setup-station'])
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
