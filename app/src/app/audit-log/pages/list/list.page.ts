import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuditLogService, AuditLogQuery } from '../../store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public auditLog$: Observable<any>;
	public pagination$: Observable<any>;
	public currentPage = 1;

	constructor(
		private auditLogService: AuditLogService,
		private auditLogQuery: AuditLogQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.auditLog$ = this.auditLogQuery.selectAll();
		this.pagination$ = this.auditLogQuery.pagination$;

		this.fetchContent();
	}

	public onPageUpdate(pagination) {
		this.auditLogService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public fetchContent() {
		this.auditLogService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
