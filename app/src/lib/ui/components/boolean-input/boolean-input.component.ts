import { Subject } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { InputMode } from '~lib/shared.types';

@Component({
	selector: 'app-boolean-input',
	templateUrl: './boolean-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => BooleanInputComponent),
			multi: true,
		},
	],
})
export class BooleanInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() mode: InputMode = InputMode.EDIT;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public inputMode = InputMode;
	public control: FormControl = new FormControl(false);
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
