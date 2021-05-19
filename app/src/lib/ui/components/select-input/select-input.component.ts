import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
	selector: 'app-select-input',
	templateUrl: './select-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => SelectInputComponent),
			multi: true,
		},
	],
})
export class SelectInputComponent implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {
	@Input() label?: string;
	@Input() placeholder = '';
	@Input() disabled = false;
	@Input() options = [];

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

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

	public trackByFn(index, item) {
		return index;
	}

	public ngOnChanges(changes: any) {
		if (changes.options) {
			// Update rendering or something
		}
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
