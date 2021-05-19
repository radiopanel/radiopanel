import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { pathOr } from 'ramda';

import { Component, forwardRef, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { InputMode } from '~lib/shared.types';

@Component({
	selector: 'app-dynamic-input',
	templateUrl: './dynamic-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => DynamicInputComponent),
			multi: true,
		},
	],
})
export class DynamicInputComponent implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {
	@Input() label?: string;
	@Input() config?: any;
	@Input() subfields?: any[];
	@Input() component: string;
	@Input() itemLabel: string;
	@Input() itemValue: string;
	@Input() endpoint: string;
	@Input() multiLanguage = false;
	@Input() mode: InputMode = InputMode.EDIT;
	@Input() language = null;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();
	private originalValue: any;
	private completeValue: any;

	public control: FormControl = new FormControl('');
	public updateValue = (_: any) => {};

	constructor(public ngControl: NgControl) {
		ngControl.valueAccessor = this;
	}

	private propagateChange(value: any): void {
		if (this.multiLanguage && this.updateValue) {
			this.completeValue = {
				...this.originalValue,
				[this.language]: value
			};
			return this.updateValue(this.completeValue);
		}

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

	public ngOnChanges(changes: any) {
		if (changes.language && this.completeValue && this.multiLanguage) {
			this.writeValue(this.completeValue);
		}
	}

	public ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public writeValue(value: any) {
		this.originalValue = value;

		if (this.multiLanguage) {
			return setTimeout(() => this.control.setValue(pathOr('', [this.language])(value)));
		}

		setTimeout(() => this.control.setValue(value));
	}

	public registerOnChange(fn: any) {
		this.updateValue = fn;
	}

	public registerOnTouched() {}
}
