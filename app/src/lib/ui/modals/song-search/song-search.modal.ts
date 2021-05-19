import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlotTypeQuery } from '~lib/store';
import { map, first, takeUntil, debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
	templateUrl: 'song-search.modal.html',
})
export class SongSearchModalComponent implements OnInit {
	public form: FormGroup;
	public songs: any[];
	public loading = false;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		public dialogRef: MatDialogRef<SongSearchModalComponent>,
		private formBuilder: FormBuilder,
		private http: HttpClient,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			search: [this.data?.originalTitle || null, Validators.required],
		});
	}

	public doSearch(e: Event): void {
		this.loading = true;
		this.http.get('/api/v1/songs/search', {
			params: { title: this.form.get('search').value }
		})
			.pipe(first())
			.subscribe((result: any) => {
				this.songs = result._embedded;
				this.loading = false;
			});
	}

	save(e: Event, song: any): void {
		e.preventDefault();
		this.dialogRef.close(song);
	}

	close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
