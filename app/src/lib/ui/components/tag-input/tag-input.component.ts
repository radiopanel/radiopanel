import { path, pathOr, prop } from 'ramda';
import { Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

import { DynamicInputService } from '../../services';

@Component({
	selector: 'app-tag-input',
	templateUrl: './tag-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => TagInputComponent),
			multi: true,
		},
	],
})
export class TagInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() placeholder = '';
	@Input() multiple = false;
	@Input() options = [];

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public data: any;
	public control: FormControl = new FormControl('');
	public updateValue = (_: any) => { };

	constructor(
		public ngControl: NgControl,
		private dynamicInputService: DynamicInputService
	) {
		ngControl.valueAccessor = this;
	}

	public ngOnInit() {
		this.control.valueChanges.pipe(
			takeUntil(this.componentDestroyed$),
		).subscribe((value) => {
			return this.propagateChange(pathOr(value, ['value'])(value));
		});
	}

	private propagateChange(value: any): void {
		if (this.updateValue) {
			return this.updateValue(value);
		}

		if (this.control) {
			this.control.setValue(value);
		}
	}

	public ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public writeValue(value: any) {
		if (!value) {
			return;
		}

		this.control.setValue(value);
	}

	public registerOnChange(fn: any) {
		this.updateValue = fn;
	}

	public registerOnTouched() {}
}
