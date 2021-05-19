import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SessionQuery } from '~lib/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: '[feature-hoc]',
  templateUrl: './feature-hoc.component.html',
})
export class FeatureHocComponent implements OnInit, OnDestroy {
	@Input() public feature = null;

	public hasPermission = false;
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	constructor(
		private sessionQuery: SessionQuery
	) {}

	public ngOnInit() {
		this.sessionQuery.features$
			.pipe(takeUntil(this.componentDestroyed$))
			.subscribe((features) => {
				this.hasPermission = features.includes(this.feature);
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
