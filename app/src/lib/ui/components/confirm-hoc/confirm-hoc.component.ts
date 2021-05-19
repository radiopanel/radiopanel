import { Component, Input, OnInit, OnDestroy, HostListener, Output, EventEmitter, Directive } from '@angular/core';
import { SessionQuery } from '~lib/store';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '~lib/ui/modals';

@Directive({
  selector: '[confirm]',
})
export class ConfirmHocComponent implements OnDestroy {
	@Input() public confirmAction = 'delete';

	@Output() public confirm = new EventEmitter();

	public hasPermission = false;
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private dialog: MatDialog
	) {}

	@HostListener('click', ['$event'])
	public onClick(e: Event): void {
		const dialog = this.dialog.open(ConfirmModalComponent, {
			data: {
				action: this.confirmAction
			}
		});

		dialog.afterClosed()
			.pipe(first())
			.subscribe((result) => {
				if (result) {
					this.confirm.emit(e);
				}
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
