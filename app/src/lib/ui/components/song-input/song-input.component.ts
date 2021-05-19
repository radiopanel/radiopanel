import { pathOr } from 'ramda';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

import { SongSearchModalComponent } from '~lib/ui/modals';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-song-input',
	templateUrl: './song-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => SongInputComponent),
			multi: true,
		},
	],
})
export class SongInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
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
		private dialog: MatDialog,
	) {
		ngControl.valueAccessor = this;
	}

	public ngOnInit() {
		this.control.valueChanges.pipe(
			takeUntil(this.componentDestroyed$),
		).subscribe((value) => {
			this.propagateChange(pathOr(value, ['value'])(value));
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

	public openSearchModal(e: Event) {
		e.preventDefault();

		const dialogRef = this.dialog.open(SongSearchModalComponent);

		dialogRef.afterClosed().pipe(first()).subscribe(newMetadata => {
			this.control.setValue(newMetadata);
		});
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
