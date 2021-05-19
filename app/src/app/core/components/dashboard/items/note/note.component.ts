import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, debounceTime, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { propOr } from 'ramda';
import { Subject } from 'rxjs';

@Component({
	templateUrl: './note.component.html'
})
export class NoteComponent implements OnInit, OnDestroy {
	@Input() public configuration = null;
	@Output() public applyConfiguration = new EventEmitter();

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();
	public data: any;
	public loading: any;
	public control: FormControl;

	constructor(
		private http: HttpClient,
	) {}

	public ngOnInit(): void {
		this.control = new FormControl(propOr(null, 'data')(this.configuration));

		this.control.valueChanges
			.pipe(
				takeUntil(this.componentDestroyed$),
				debounceTime(1000)
			)
			.subscribe((value) => {
				this.applyConfiguration.emit(value);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
