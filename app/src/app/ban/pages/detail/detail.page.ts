import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BanService } from '../../../../lib/store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public ban: any;

	constructor(
		private banService: BanService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			identifier: ['', Validators.required],
			comment: ['', Validators.required],
			expiresAt: [null],
		});

		this.banService.fetchOne(this.activatedRoute.snapshot.params.id)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.ban = values;
				this.form.patchValue(values);
			});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.form.markAllAsTouched();

		if (!this.form.valid) {
			return;
		}

		this.banService.update(
			this.activatedRoute.snapshot.params.id,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Ban updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.banService.delete(
			this.activatedRoute.snapshot.params.id
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Ban deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
