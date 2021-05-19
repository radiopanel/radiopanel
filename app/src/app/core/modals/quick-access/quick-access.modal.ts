import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionQuery } from '~lib/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { Tenant } from '~lib/store/session/session.store';
import { first, map, takeUntil } from 'rxjs/operators';

import { adminLinks, coreLinks, myStationLinks } from '../../components/sidebar/sidebar.const';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	templateUrl: 'quick-access.modal.html',
})
export class QuickAccessModalComponent implements OnInit, OnDestroy {
	public links$: Observable<any>;
	public searchForm = new FormControl('');
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();
	public links = [];
	public selectedIndex = 0;

	constructor(
		public dialogRef: MatDialogRef<QuickAccessModalComponent>,
		private sessionQuery: SessionQuery,
		private router: Router,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	public ngOnInit(): void {
		this.links$ = combineLatest(
			this.sessionQuery.permissions$,
			this.sessionQuery.features$,
			this.sessionQuery.contentTypes$,
			this.sessionQuery.pageTypes$,
			this.searchForm.valueChanges,
		)
			.pipe(
				takeUntil(this.componentDestroyed$),
				map(([permissions, features, contentTypes, pageTypes, searchValue]) => {
					const links = [...adminLinks(permissions, features), ...coreLinks(permissions, features), ...myStationLinks(permissions, features)].filter((x) => x.show);

					if (permissions.includes('content-types/read')) {
						links.push(...(contentTypes || []).map((contentType) => ({
							icon: 'subject',
							name: contentType.name,
							link: `/content/${contentType.uuid}/entries`,
							show: true
						})));
					}

					if (permissions.includes('page-types/read')) {
						links.push(...(pageTypes || []).map((pageType) => ({
							icon: 'file',
							name: pageType.name,
							link: `/pages/${pageType.uuid}`,
							show: true
						})));
					}

					const filteredLinks = links.filter(link => link.name.toLowerCase().includes(searchValue.toLowerCase()));
					this.links = filteredLinks;

					return filteredLinks;
				})
			);
	}

	public handleEnter(): void {
		const link = this.links[this.selectedIndex];

		if (!link) {
			return;
		}

		this.dialogRef.close();
		this.router.navigate([link.link]);
	}

	public handleUp(e: Event): void {
		e.preventDefault();
		if (this.selectedIndex === 0) {
			return;
		}

		this.selectedIndex = this.selectedIndex - 1;
	}

	public handleDown(e: Event): void {
		e.preventDefault();
		if (this.selectedIndex === this.links.length - 1) {
			return;
		}

		this.selectedIndex = this.selectedIndex + 1;
	}

	public handleMouseEnter(index: number): void {
		this.selectedIndex = index;
	}

	public handleClick(): void {
		this.dialogRef.close();
	}

	public chooseTenant(e: Event, tenantUuid: string): void {
		e.preventDefault();
		this.dialogRef.close();
	}

	public close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
