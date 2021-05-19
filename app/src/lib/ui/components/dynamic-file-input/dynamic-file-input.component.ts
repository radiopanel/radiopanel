import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { getType } from 'mime';
import uuid from 'uuid';

@Component({
	selector: 'app-dynamic-file-input',
	templateUrl: './dynamic-file-input.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => DynamicFileInputComponent),
			multi: true,
		},
	],
})
export class DynamicFileInputComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() label?: string;
	@Input() placeholder = '';
	@Input() type = 'file';
	@Input() key: string = uuid.v4();
	@Input() disabled = false;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public id = uuid.v4();
	public circumference = 20 * 2 * Math.PI;
	public isUploading = false;
	public uploadProgress = 0;
	public control: FormControl = new FormControl('');
	public updateValue = (_: any) => {};

	constructor(
		public ngControl: NgControl,
		private http: HttpClient,
	 ) {
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

	public clearInput(e: Event): void {
		e.preventDefault();
		this.updateValue(null);
		this.control.setValue(null);
	}

	public shouldShowImage(): boolean {
		return (getType(this.control.value) || 'image/png').startsWith('image');
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

	onFileChange(fileEvent) {
		if (fileEvent.target.files.length > 0) {
			const file = fileEvent.target.files[0];

			const formData: FormData = new FormData();
			formData.append('file', file, file.name);

			this.http.post('/api/v1/storage/upload', formData, {
				reportProgress: true,
				observe: 'events',
				params: {
					key: this.key,
				},
				headers: {
					'X-FileName': file.name,
				}
			})
				.pipe(takeUntil(this.componentDestroyed$))
				.subscribe((event: HttpEvent<any>) => {
					switch (event.type) {
						case HttpEventType.Sent:
							this.isUploading = true;
							break;
						case HttpEventType.UploadProgress:
							this.uploadProgress = Math.round(event.loaded / event.total * 100);
							break;
						case HttpEventType.Response:
							this.propagateChange(event.body.url);
							this.control.setValue(event.body.url);
							this.isUploading = false;
							this.uploadProgress = 0;
					  }
				});
		}
	}

	public getDashOffset() {
		if (this.isUploading && this.uploadProgress === 100) {
			return this.circumference - 25 / 100 * this.circumference;
		}

		return this.circumference - this.uploadProgress / 100 * this.circumference;
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
