import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RulePageService } from '../../store';

@Component({
	templateUrl: './create.page.html'
})
export class CreatePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public contentType$: any;

	constructor(
		private rulePageService: RulePageService,
		private formBuilder: FormBuilder,
		private toastr: ToastrService,
		private router: Router,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			content: ['', Validators.required],
		});
	}

	public submit(e: Event) {
		this.rulePageService.create(this.form.value)
			.pipe(
				first()
			).subscribe((result) => {
				this.toastr.success('Rule page created', 'Success');
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
