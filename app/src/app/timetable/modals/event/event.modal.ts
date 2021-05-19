import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SlotTypeQuery } from '~lib/store';
import { map, first, debounceTime } from 'rxjs/operators';
import { SlotService } from '../../store';
import { Slot } from '../../store/slots/slot.store';
import { markFormGroupTouched } from '../../helpers/form-helper';
import { propOr, pathOr } from 'ramda';

@Component({
	templateUrl: 'event.modal.html',
})
export class EventModalComponent implements OnInit {
	public form: FormGroup;
	public slotTypes$: Observable<any[]>;
	public conflictingSlots: Slot[];
	public activeTab = 'general';

	constructor(
		public dialogRef: MatDialogRef<EventModalComponent>,
		private formBuilder: FormBuilder,
		private slotService: SlotService,
		private slotTypeQuery: SlotTypeQuery,
		@Inject(MAT_DIALOG_DATA) public data: {
			user: any;
			permissions: string[];
			event: any;
		}
	) { }

	ngOnInit(): void {
		this.slotTypes$ = this.slotTypeQuery.selectAll()
			.pipe(
				map((slotTypes) => {
					return slotTypes.map((slotType) => ({
						label: slotType.name,
						value: slotType.uuid
					}));
				})
			);

		this.form = this.formBuilder.group({
			title: ['', Validators.required],
			slotTypeUuid: ['', Validators.required],
			userUuid: [this.data.user.uuid],
			start: ['', Validators.required],
			end: ['', Validators.required],
			recurring: [false, Validators.required],
		});

		if (this.data.event) {
			this.form.patchValue({
				...this.data.event,
				...this.data.event.meta.originalTimings
			});
			this.ensureNoConflicts();
		}

		// TODO: add takeuntil
		this.form.valueChanges
			.pipe(
				debounceTime(100)
			)
			.subscribe(() => setTimeout(() => this.ensureNoConflicts()));
	}

	private ensureNoConflicts(): void {
		this.slotService.verify({
			...this.form.value,
			uuid: pathOr(null, ['event', 'uuid'])(this.data),
			start: moment(this.form.value.start).unix(),
			end: moment(this.form.value.end).unix(),
		})
		.toPromise()
		.then((slots) => this.conflictingSlots = slots);
	}

	public canBookForOtherUsers(): boolean {
		return !!(this.data.permissions || []).includes('timetable/book-other');
	}

	public setActiveTab(e: Event, tab: string) {
		e.preventDefault();

		this.activeTab = tab;
	}

	public shouldShowDeleteButton(): boolean {
		if (!this.data.event.uuid) {
			return false;
		}

		if (this.data.permissions.includes('timetable/delete-own') && this.data.event.userUuid === this.data.user.uuid) {
			return true;
		}

		if (this.data.permissions.includes('timetable/delete-other')) {
			return true;
		}

		return false;
	}

	public save(e: Event): void {
		markFormGroupTouched(this.form);

		if (!this.form.valid) {
			return;
		}

		e.preventDefault();
		this.dialogRef.close(this.form.value);
	}

	public delete(e: Event, tempDelete = false): void {
		e.preventDefault();

		if (!tempDelete) {
			return this.dialogRef.close('delete');
		}

		return this.dialogRef.close('temp-delete');
	}

	public close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}
}
