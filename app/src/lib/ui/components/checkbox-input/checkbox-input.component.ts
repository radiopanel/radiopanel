import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
	selector: 'app-checkbox-input',
	templateUrl: './checkbox-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => CheckboxInputComponent),
			multi: true,
		},
	],
})
export class CheckboxInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() name?: string;
	@Input() value?: string;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public uuid = uuid.v4();
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
