import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { BannerService } from '../../store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public banner;
	public form: FormGroup;
	public contentType: any;

	constructor(
		private bannerService: BannerService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			slug: ['', Validators.required],
			link: [''],
			tag: [''],
			image: ['', Validators.required],
		});

		this.bannerService.fetchOne(this.activatedRoute.snapshot.params.id)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.banner = values;
				this.form.patchValue(values);
			});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			return;
		}

		this.bannerService.update(
			this.activatedRoute.snapshot.params.id,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Banner updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.bannerService.delete(
			this.activatedRoute.snapshot.params.id
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Banner deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
