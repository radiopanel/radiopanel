import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { WebhookService } from '../../store';
import slugify from 'slugify';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType$: any;

	constructor(
		private webhookService: WebhookService,
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			type: [null, Validators.required],
			destination: [null, Validators.required],
			url: ['', Validators.required],
		});

		this.form.get('name').valueChanges.pipe(
			takeUntil(this.componentDestroyed$)
		).subscribe((value) => this.form.patchValue({
			slug: slugify(value).toLowerCase()
		}));
	}

	public submit(e: Event) {
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			return;
		}

		this.webhookService.create(this.form.value)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Webhook created', 'Success');
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
