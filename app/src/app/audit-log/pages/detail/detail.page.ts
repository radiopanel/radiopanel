import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuditLogService } from '../../store';

@Component({
	templateUrl: './detail.page.html'
})
export class DetailPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public auditLog: any;

	constructor(
		private auditLogService: AuditLogService,
		private activatedRoute: ActivatedRoute,
	) { }

	public ngOnInit(): void {
		this.auditLogService.fetchOne(this.activatedRoute.snapshot.params.uuid)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe((values) => {
				this.auditLog = values;
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
