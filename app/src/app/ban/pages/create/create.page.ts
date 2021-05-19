import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BanService } from '../../../../lib/store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;

	constructor(
		private banService: BanService,
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			identifier: [this.activatedRoute.snapshot.queryParams.identifier || '', Validators.required],
			comment: ['', Validators.required],
			expiresAt: [null],
		});
	}

	public submit(e: Event) {
		this.form.markAllAsTouched();

		if (!this.form.valid) {
			return;
		}

		this.banService.create(this.form.value)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Ban created', 'Success');
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
