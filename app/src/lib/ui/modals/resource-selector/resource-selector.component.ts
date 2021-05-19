import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-resource-selector',
	templateUrl: 'resource-selector.component.html',
})
export class ResourceSelectorComponent implements OnInit {
	public contentFields$: any;
	public selectedResources: string[];

	constructor(
		public dialogRef: MatDialogRef<ResourceSelectorComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {

	}

	handleSelection(result: string | string[]): void {
		if (!this.data.multiple) {
			this.dialogRef.close(result);
		}

		this.selectedResources = result as string[];
	}

	public save() {
		this.dialogRef.close(this.selectedResources);
	}

	close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}
}
