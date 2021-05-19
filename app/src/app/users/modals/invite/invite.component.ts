import { Observable } from 'rxjs';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	templateUrl: 'invite.component.html',
})
export class InviteModalComponent implements OnInit {
	public form: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<InviteModalComponent>,
		private formBuilder: FormBuilder,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			username: ['', Validators.required],
			emailAddress: ['', Validators.required],
			roleUuid: ['', Validators.required]
		});
	}

	save(): void {
		this.dialogRef.close(this.form.value);
	}

	close(): void {
		this.dialogRef.close();
	}
}
