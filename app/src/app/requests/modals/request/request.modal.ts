import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlotTypeQuery } from '~lib/store';
import { map, first } from 'rxjs/operators';
import { markFormGroupTouched } from '../../helpers/form-helper';

@Component({
	templateUrl: 'request.modal.html',
})
export class RequestModalComponent implements OnInit {
	public form: FormGroup;

	constructor(
		public dialogRef: MatDialogRef<RequestModalComponent>,
		private formBuilder: FormBuilder,
		private slotTypeQuery: SlotTypeQuery,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			message: ['', Validators.required],
			type: ['', Validators.required],
		});
	}

	save(e: Event): void {
		markFormGroupTouched(this.form);

		if (!this.form.valid) {
			return;
		}

		e.preventDefault();
		this.dialogRef.close({
			...this.form.value,
			requestOrigin: 'manual'
		});
	}

	close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}
}
