import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	templateUrl: 'confirm.modal.html',
})
export class ConfirmModalComponent {
	constructor(
		public dialogRef: MatDialogRef<ConfirmModalComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	public confirm() {
		this.dialogRef.close(true);
	}

	public cancel(e: Event): void {
		e.preventDefault();
		this.dialogRef.close(false);
	}
}
