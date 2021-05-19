import { ToastrService } from 'ngx-toastr';
import { pathOr } from 'ramda';
import { combineLatest, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SongService } from '../../store';
import { MatDialog } from '@angular/material/dialog';
import { SongSearchModalComponent } from '~lib/ui/modals';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public form: FormGroup;
	public song: any;

	constructor(
		private bannerService: SongService,
		private formBuilder: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private toastr: ToastrService,
	) { }

	public ngOnInit(): void {
		this.form = this.formBuilder.group({
			album: ['', Validators.required],
			artist: ['', Validators.required],
			title: ['', Validators.required],
			extraInfo: [{}, Validators.required],
			graphic: this.formBuilder.group({
				large: ['', Validators.required],
				medium: ['', Validators.required],
				small: ['', Validators.required],
			})
		});

		this.bannerService.fetchOne(this.activatedRoute.snapshot.params.songUuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.song = values;
				this.form.patchValue(values);
			});
	}

	public openSearchModal(e: Event) {
		e.preventDefault();

		const dialogRef = this.dialog.open(SongSearchModalComponent, {
			data: {
				originalTitle: this.song.originalTitle,
			}
		});

		dialogRef.afterClosed().pipe(first()).subscribe(newMetadata => {
			this.form.patchValue(newMetadata);
			this.toastr.success('New metadata applied, do not forget to hit save');
		});
	}

	public submit(e: Event) {
		e.preventDefault();
		this.form.markAllAsTouched();

		if (this.form.invalid) {
			return;
		}

		this.bannerService.update(
			this.activatedRoute.snapshot.params.songUuid,
			this.form.value
		)
			.pipe(
				first()
			).subscribe(() => {
				this.toastr.success('Song updated', 'Success');
			});
	}

	public delete(e: Event) {
		e.preventDefault();
		this.bannerService.delete(
			this.activatedRoute.snapshot.params.songUuid
		)
			.pipe(
				first()
			).subscribe(() => {
				this.router.navigate(['../'], {
					relativeTo: this.activatedRoute
				});
				this.toastr.warning('Song deleted', 'Success');
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
