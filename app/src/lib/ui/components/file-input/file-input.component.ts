import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getType } from 'mime';
import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ResourceSelectorComponent } from '../../modals';

@Component({
	selector: 'app-file-input',
	templateUrl: './file-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => FileInputComponent),
			multi: true,
		},
	],
})
export class FileInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() placeholder = '';
	@Input() type = 'file';
	@Input() disabled = false;
	@Input() multiple = false;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public control: FormControl = new FormControl('');
	public updateValue = (_: any) => {};

	constructor(
		public ngControl: NgControl,
		private dialog: MatDialog,
	) {
		ngControl.valueAccessor = this;
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

	public openModal() {
		const dialogRef = this.dialog.open(ResourceSelectorComponent, {
			data: {
				allowedExtensions: '',
				multiple: this.multiple,
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
					return this.control.setValue([...(this.control.value || []), ...value]);
				}

				this.control.setValue(value);
			});
	}

	public isImage(path: string): boolean {
		if (!path) {
			return false;
		}

		const type = getType(path);

		if (!type) {
			return false;
		}

		return type?.startsWith('image/');
	}

	private propagateChange(value: any): void {
		if (this.updateValue) {
			return this.updateValue(value);
		}

		if (this.control) {
			this.control.setValue(value);
		}
	}

	public removeFile(index: number) {
		const toSplice = JSON.parse(JSON.stringify(this.control.value));
		toSplice.splice(index, 1);
		return this.control.setValue(toSplice);
	}

	onFileChange(event) {
		if (event.target.files.length > 0) {
			const file = event.target.files[0];
			this.propagateChange(file);
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
