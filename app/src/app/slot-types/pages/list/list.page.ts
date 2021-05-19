import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SlotTypeService, SlotTypeQuery } from '~lib/store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public slotTypes$: Observable<any>;
	public loading$: Observable<boolean>;

	constructor(
		private slotTypeService: SlotTypeService,
		private slotTypeQuery: SlotTypeQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.slotTypes$ = this.slotTypeQuery.selectAll();
		this.loading$ = this.slotTypeQuery.selectLoading();

		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.fetchContent();

	}

	public fetchContent() {
		this.slotTypeService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
