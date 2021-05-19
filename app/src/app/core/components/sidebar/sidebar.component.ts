import { Observable, Subject, combineLatest } from 'rxjs';
import { first, map, takeUntil, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { version } from '../../../../../package.json';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';

import { SessionQuery, StatusQuery, StatusService } from '~lib/store';
import { coreLinks, adminLinks, myStationLinks } from './sidebar.const';
import { AuthService } from '../../services';
import { TenantSelectorComponent } from '../../modals';
import { Router } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {
	@Input() tenants;

	@Output() logout: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() tenantSelected: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild(NgScrollbar) scrollbarRef: NgScrollbar;

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();
	public status$: Observable<any>;
	public tenantSelectorOpen = false;
	public coreLinks: any = [];
	public adminLinks: any = [];
	public myStationLinks: any = [];
	public contentTypeLinks: any = [];
	public pageTypeLinks: any = [];
	public tenant$: Observable<any>;
	public contentTypes$: Observable<any[]>;
	public pageTypes$: Observable<any[]>;
	public user$: Observable<any>;
	public permissions$: Observable<string[]>;
	public features$: Observable<string[]>;
	public open = false;
	public scrolledToTop = true;
	public scrolledToBottom = false;
	public version = version;

	constructor(
		public sessionQuery: SessionQuery,
		public statusService: StatusService,
		public statusQuery: StatusQuery,
		private dialog: MatDialog,
		private router: Router,
		private authService: AuthService,
	) { }

	public ngOnInit(): void {
		this.statusService.fetch().subscribe();

		this.router.events.subscribe(() => {
			this.open = false;
		});

		this.user$ = this.sessionQuery.user$;
		this.permissions$ = this.sessionQuery.permissions$;
		this.features$ = this.sessionQuery.features$;
		this.contentTypes$ = this.sessionQuery.contentTypes$;
		this.pageTypes$ = this.sessionQuery.pageTypes$;
		this.status$ = this.statusQuery.status$;
		this.tenant$ = this.sessionQuery.tenant$;

		combineLatest(this.permissions$, this.features$, this.contentTypes$, this.pageTypes$)
			.subscribe(([permissions, features, contentTypes, pageTypes]) => {
				this.adminLinks = adminLinks(permissions, features).filter((x) => x.show);
				this.coreLinks = coreLinks(permissions, features).filter((x) => x.show);
				this.myStationLinks = myStationLinks(permissions, features).filter((x) => x.show);

				if (permissions.includes('content-types/read')) {
					this.contentTypeLinks = (contentTypes || []).map((contentType) => ({
						icon: 'subject',
						name: contentType.name,
						link: `/content/${contentType.uuid}/entries`,
						show: true
					}));
				}

				if (permissions.includes('page-types/read')) {
					this.pageTypeLinks = (pageTypes || []).map((pageType) => ({
						icon: 'file',
						name: pageType.name,
						link: `/pages/${pageType.uuid}`,
						show: true
					}));
				}
			});
	}

	public ngAfterViewInit(): void {
		this.scrollbarRef.scrolled.subscribe(e => {
			if (e.target.scrollHeight - e.target.offsetHeight === e.target.scrollTop) {
				this.scrolledToBottom = true;
				this.scrolledToTop = false;
			} else if (e.target.scrollTop === 0) {
				this.scrolledToBottom = false;
				this.scrolledToTop = true;
			} else {
				this.scrolledToBottom = false;
				this.scrolledToTop = false;
			}
		});
	}

	public openTenantSelector(e: Event): void {
		e.preventDefault();
		const dialogRef = this.dialog.open(TenantSelectorComponent);

		dialogRef.afterClosed().pipe(first()).subscribe((result) => {
			this.tenantSelected.emit(result);
		});
	}

	public toggleOpen(e: Event) {
		this.open = !this.open;
	}

	public chooseTenant(e: Event, tenant: any) {
		e.preventDefault();
		this.tenantSelectorOpen = false;
		this.tenantSelected.emit(tenant);
	}

	public toggleTenantSelector(e: Event) {
		e.preventDefault();
		this.tenantSelectorOpen = !this.tenantSelectorOpen;
	}

	public handleLogout(e: Event) {
		e.preventDefault();
		this.logout.emit(true);
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
