import { Observable } from 'rxjs';

import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-icon-selector',
	templateUrl: 'icon-selector.component.html',
})
export class IconSelectModalComponent implements OnInit {
	public contentFields$: any;
	public loading$: Observable<boolean>;
	public search: FormControl;
	public icons: string[];

	constructor(
		public dialogRef: MatDialogRef<IconSelectModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {
		this.search = new FormControl('');
		this.icons = [];

		this.search.valueChanges.subscribe((value) => {
			if (!value) {
				return this.icons = [];
			}

			if (value.length < 2) {
				return this.icons = [];
			}

			this.icons = this.data.icons.filter((str) => {
				return new RegExp(value, 'i').test(str);
			});
		});
	}

	selectIcon(icon: string): void {
		this.dialogRef.close(icon);
	}

	close(): void {
		this.dialogRef.close();
	}
}
