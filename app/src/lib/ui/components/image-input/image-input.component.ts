import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ResourceSelectorComponent } from '../../modals';
import { SessionQuery } from '../../../store/index';

@Component({
	selector: 'app-image-input',
	templateUrl: './image-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => ImageInputComponent),
			multi: true,
		},
	],
})
export class ImageInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() multiple = false;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public tenant: string;
	public control =  new FormControl('');
	public updateValue = (_: any) => {};

	constructor(
		public ngControl: NgControl,
		private dialog: MatDialog,
		private sessionQuery: SessionQuery,
	) {
		ngControl.valueAccessor = this;
	}

	public ngOnInit() {
		this.control.valueChanges.pipe(
			takeUntil(this.componentDestroyed$),
		).subscribe((value) => {
			this.propagateChange(JSON.parse(value));
		});

		this.sessionQuery.tenant$
			.pipe(
				first()
			)
			.subscribe((tenantData) => {
				this.tenant = tenantData.uuid;
			});
	}

	public jsonParse(json: string): any {
		try {
			return JSON.parse(json);
		} catch (e) {
			return null;
		}
	}

	public openModal() {
		const dialogRef = this.dialog.open(ResourceSelectorComponent, {
			data: {
				multiple: this.multiple,
				allowedExtensions: ['jpg', 'png', 'jpeg'],
			}
		});

		dialogRef.afterClosed()
			.pipe(
				takeUntil(this.componentDestroyed$)
			)
			.subscribe((value) => {
				if (!value) {
					return;
				}

				if (this.multiple) {
					const currentImages = JSON.parse(this.control.value);
					return this.control.setValue(JSON.stringify([...currentImages, ...value]));
				}

				this.control.setValue(JSON.stringify(value));
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

	public handleDrop(images: any) {
		return this.control.setValue(JSON.stringify(images));
	}

	public removeImage(index: number) {
		const currentImages = JSON.parse(this.control.value);
		currentImages.splice(index, 1);
		return this.control.setValue(JSON.stringify(currentImages));
	}

	public ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public writeValue(value: any) {
		setTimeout(() => this.control.setValue(JSON.stringify(value)));
	}

	public registerOnChange(fn: any) {
		this.updateValue = fn;
	}

	public registerOnTouched() {}
}
