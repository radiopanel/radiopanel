import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { InputMode } from '~lib/shared.types';

@Component({
	selector: 'app-text-input',
	templateUrl: './text-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => TextInputComponent),
			multi: true,
		},
	],
})
export class TextInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() placeholder = '';
	@Input() type = 'text';
	@Input() disabled = false;
	@Input() icon?: string;
	@Input() name?: string;
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
