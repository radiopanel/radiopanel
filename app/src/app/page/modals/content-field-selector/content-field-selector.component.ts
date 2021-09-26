import { Observable } from 'rxjs';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { PageTypeFieldQuery, PageTypeFieldService } from '../../store';
import { first } from 'rxjs/operators';

@Component({
	selector: 'app-content-field-selector',
	templateUrl: 'content-field-selector.component.html',
})
export class PageFieldSelectorModalComponent implements OnInit {
	public contentFields$: any;
	public loading$: Observable<boolean>;

	constructor(
		private contentTypeFieldService: PageTypeFieldService,
		private contentTypeFieldQuery: PageTypeFieldQuery,
		public dialogRef: MatDialogRef<PageFieldSelectorModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {
		this.contentFields$ = this.contentTypeFieldQuery.results$;
		this.loading$ = this.contentTypeFieldQuery.loading$;

		this.contentTypeFieldService.fetchPageFields()
			.pipe(first())
			.subscribe();
	}

	addField(field): void {
		this.dialogRef.close(field);
	}

	close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}
}
