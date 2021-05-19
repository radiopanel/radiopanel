import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SessionQuery } from '~lib/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: '[permission-hoc]',
  templateUrl: './permission-hoc.component.html',
})
export class PermissionHocComponent implements OnInit, OnDestroy {
	@Input() public permission = null;

	public hasPermission = false;
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private sessionQuery: SessionQuery
	) {}

	public ngOnInit() {
		this.sessionQuery.permissions$
			.pipe(takeUntil(this.componentDestroyed$))
			.subscribe((permissions) => {
				this.hasPermission = permissions.includes(this.permission);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
