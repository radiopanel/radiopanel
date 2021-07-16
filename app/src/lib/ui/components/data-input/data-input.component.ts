import { path, pathOr, prop } from 'ramda';
import { Observable, Subject } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

import { DynamicInputService } from '../../services';

@Component({
	selector: 'app-data-input',
	templateUrl: './data-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => DataInputComponent),
			multi: true,
		},
	],
})
export class DataInputComponent implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {
	@Input() label?: string;
	@Input() placeholder = '';
	@Input() multiple = false;
	@Input() options = [];
	@Input() itemLabel = ['name'];
	@Input() itemValue = ['uuid'];
	@Input() endpoint: string;

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
		this.doSearch();
		this.control.valueChanges.pipe(
			takeUntil(this.componentDestroyed$),
		).subscribe((value) => {
			if (!this.multiple) {
				return this.propagateChange(pathOr(value, ['value'])(value));
			}

			this.propagateChange((value || []).map((roleItem) => pathOr(roleItem, ['value'])(roleItem)));
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

	public ngOnChanges(changes): void {
		this.doSearch();
	}

	public handleSearch(value) {
		// TODO: add debounce
		this.doSearch(value.term);
	}

	public doSearch(searchString = '') {
		this.dynamicInputService.fetchData(this.endpoint, { name: searchString, pagesize: 500 })
			.pipe(
				first(),
				map((item) => {
					return item.map((item) => ({
						value: path(this.itemValue)(item),
						label: path(this.itemLabel)(item)
					}));
				})
			)
			.subscribe(data => this.data = data);
	}

	public ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public writeValue(value: any) {
		if (!value) {
			return;
		}

		this.dynamicInputService.fetchData(this.endpoint)
			.pipe(first())
			.subscribe(data => {
				if (!this.multiple) {
					return setTimeout(() => this.control.setValue({
						value,
						label: path(this.itemLabel)(data.find((contentItem) => path(this.itemValue)(contentItem) === value))
					}));
				}

				const mappedValue = value.map((item) => ({
					value: item,
					label: path(this.itemLabel)(data.find((contentItem) => path(this.itemValue)(contentItem) === item))
				}));
				this.control.setValue(mappedValue);
			});
	}

	public registerOnChange(fn: any) {
		this.updateValue = fn;
	}

	public registerOnTouched() {}
}
