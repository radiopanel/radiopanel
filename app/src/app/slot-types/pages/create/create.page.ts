import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SlotTypeService } from '~lib/store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType$: any;

	constructor(
		private slotTypeService: SlotTypeService,
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			description: ['', Validators.required],
			color: ['', Validators.required],
		});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.slotTypeService.create(this.form.value)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Slot type created', 'Success');
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
