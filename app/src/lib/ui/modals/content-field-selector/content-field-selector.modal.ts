import { Observable } from 'rxjs';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ContentTypeFieldQuery, ContentTypeFieldService } from '~lib/store';

@Component({
	selector: 'app-content-field-selector',
	templateUrl: 'content-field-selector.modal.html',
})
export class ContentFieldSelectorModalComponent implements OnInit {
	public contentFields$: any;
	public loading$: Observable<boolean>;

	constructor(
		private contentTypeFieldService: ContentTypeFieldService,
		private contentTypeFieldQuery: ContentTypeFieldQuery,
		public dialogRef: MatDialogRef<ContentFieldSelectorModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {
		this.contentFields$ = this.contentTypeFieldQuery.results$;
		this.loading$ = this.contentTypeFieldQuery.loading$;

		this.contentTypeFieldService.fetchContentFields()
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
