import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { InputMode } from '~lib/shared.types';
import { DateTimeAdapter, MomentDateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from '@danielmoncada/angular-datetime-picker';

export const MY_CUSTOM_FORMATS = {
	parseInput: 'DD/MM/YYYY',
	fullPickerInput: 'DD/MM/YYYY HH:mm',
	datePickerInput: 'DD/MM/YYYY',
	timePickerInput: 'HH:mm',
	monthYearLabel: 'MMM-YYYY',
	dateA11yLabel: 'LL',
	monthYearA11yLabel: 'MMMM-YYYY'
};

@Component({
	selector: 'app-time-input',
	templateUrl: './time-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => TimeInputComponent),
			multi: true,
		},

		// Custom date stuff
		{ provide: DateTimeAdapter, useClass: MomentDateTimeAdapter, deps: [OWL_DATE_TIME_LOCALE] },
		{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
	],
})
export class TimeInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() placeholder = '';
	@Input() type = 'text';
	@Input() disabled = false;
	@Input() icon?: string;
	@Input() max?: string;
	@Input() mode: InputMode = InputMode.EDIT;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public inputMode = InputMode;
	public control: FormControl = new FormControl('');
	public updateValue = (_: any) => {};

	constructor(public ngControl: NgControl) {
		ngControl.valueAccessor = this;
	}

	private propagateChange(value: any): void {
		if (this.updateValue) {
			return this.updateValue(value);
		}

		if (this.control) {
			this.control.setValue(value);
		}
	}

	public ngOnInit() {
		if (this.disabled) {
			this.control.disable();
		}

		this.control.valueChanges.pipe(
			takeUntil(this.componentDestroyed$),
		).subscribe((value) => {
			this.propagateChange(value);
		});
	}

	public ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public writeValue(value: any) {
		setTimeout(() => this.control.setValue(value));
	}

	public registerOnChange(fn: any) {
		this.updateValue = fn;
	}

	public registerOnTouched() {}
}
