import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NgControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
	selector: 'app-repeater',
	templateUrl: './repeater.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => RepeaterComponent),
			multi: true,
		},
	],
})
export class RepeaterComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() subfields: any[];
	@Input() language = null;
	@Input() multiple = false;
	@Input() allowedExtensions = '';

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public control: FormArray;
	public updateValue = (_: any) => {};

	constructor(
		public ngControl: NgControl,
		private formBuilder: FormBuilder,
	) {
		ngControl.valueAccessor = this;
	}

	public ngOnInit() {
		this.control = this.formBuilder.array([]);

		this.control.valueChanges.pipe(
			takeUntil(this.componentDestroyed$),
		).subscribe((value) => {
			this.propagateChange(value);
		});
	}

	public removeField(e: Event, i: number): void {
		e.preventDefault();
		this.control.removeAt(i);
	}

	public addField(e: Event): void {
		e.preventDefault();

		// I am not ashamed of myself
		this.control.push(this.formBuilder.group(this.subfields.reduce((acc, subfield) => ({ ...acc, [subfield.slug]: [''] }), {})));
	}

	private propagateChange(value: any): void {
		if (this.updateValue) {
			return this.updateValue(value);
		}
	}

	public ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public writeValue(value: any) {
		// If it's not an array, lets not even try.
		if (!Array.isArray(value)) {
			return;
		}

		this.control.clear();
		value.map((item) => {
			const subFields = this.subfields.reduce((acc, subfield) => ({ ...acc, [subfield.slug]: [item[subfield.slug]] }), {});
			this.control.push(this.formBuilder.group(subFields));
		});
	}

	public registerOnChange(fn: any) {
		this.updateValue = fn;
	}

	public registerOnTouched() {}
}
