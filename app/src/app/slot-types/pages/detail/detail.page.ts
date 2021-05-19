import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SlotTypeService } from '~lib/store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType: any;

	constructor(
		private slotTypeService: SlotTypeService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
			color: ['', Validators.required],
		});

		this.slotTypeService.fetchOne(this.activatedRoute.snapshot.params.id)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((user) => {
				this.form.patchValue({
					...user,
					role: pathOr(null, ['role', 'uuid'])(user)
				});
			});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.slotTypeService.update(
			this.activatedRoute.snapshot.params.id,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Slot type updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.slotTypeService.delete(
			this.activatedRoute.snapshot.params.id
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Slot type deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
