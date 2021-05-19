import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { RoleQuery, RoleService } from '~lib/store';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public roles$: Observable<any>;
	public pagination$: Observable<any>;

	constructor(
		private roleService: RoleService,
		private roleQuery: RoleQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.pagination$ = this.roleQuery.select('pagination');
		this.roles$ = this.roleQuery.selectAll();
		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.fetchContent();
	}

	public onPageUpdate(pagination) {
		this.roleService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public fetchContent() {
		this.roleService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
