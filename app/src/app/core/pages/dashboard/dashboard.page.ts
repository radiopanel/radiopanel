import { Observable } from 'rxjs';
import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { GridsterConfig, GridsterItem, GridType, DisplayGrid, CompactType }  from 'angular-gridster2';

import { DashboardQuery, DashboardService } from '../../store';
import { first, tap, debounceTime } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DashboardItemSelectorComponent } from '../../modals';
import { clone, set, lensPath, propOr } from 'ramda';
import { SessionQuery } from '~lib/store';

@Component({
	templateUrl: './dashboard.page.html',
	encapsulation: ViewEncapsulation.None
})
export class DashboardPageComponent implements OnInit {
	public data$: Observable<any>;
	public options: GridsterConfig;
	public dashboard: Array<GridsterItem> = [];
	public tenantInfo$: Observable<any>;
	public permissions$: Observable<any>;
	public user$: Observable<any>;
	public configurations = [];

	constructor(
		private dashboardService: DashboardService,
		private dashboardQuery: DashboardQuery,
		private sessionQuery: SessionQuery,
		private dialog: MatDialog,
	) { }

	private handleItemChanged = () => {
		this.dashboardService.save(this.dashboard).pipe(first()).subscribe();
	}

	public fetch(): void {
		this.dashboardService.fetch()
			.pipe(first())
			.subscribe((dashboard: any) => {
				if (!dashboard) {
					this.dashboard = [];
					this.configurations = [];
					return;
				}

				this.dashboard = clone(dashboard.data || []);
				this.configurations = clone(dashboard.data || []).map((dashboard) => dashboard.configuration) || [];
			});
	}

	ngOnInit(): void {
		this.permissions$ = this.sessionQuery.permissions$;
		this.user$ = this.sessionQuery.user$;
		this.tenantInfo$ = this.sessionQuery.tenant$;

		this.sessionQuery.tenant$.subscribe(() => {
			this.fetch();
		});

		this.options = {
			gridType: GridType.Fit,
			displayGrid: DisplayGrid.None,
			compactType: CompactType.None,
			pushItems: true,
			outerMargin: false,
			draggable: {
				enabled: true,
				ignoreContentClass: 'm-dashboard-item__content',
				ignoreContent: false,
				dragHandleClass: 'm-dashboard-item__header',
			},
			resizable: {
				enabled: true
			},
			minCols: 24,
			maxCols: 24,
			minRows: 24,
			maxRows: 24,
			itemChangeCallback: this.handleItemChanged
		};

		this.data$ = this.dashboardQuery.results$;
	}

	public changedOptions(): void {
		if (this.options.api && this.options.api.optionsChanged) {
			this.options.api.optionsChanged();
		}
	}

	public pushNewDashboard(): void {
		this.dashboardService.save(this.dashboard.map((dashboard, index: any) => ({
			...dashboard,
			configuration: propOr(null, index)(this.configurations)
		}))).pipe(first()).subscribe();
	}

	public handleConfiguration(index: number, data: any): void {
		this.configurations = set(lensPath([index, 'data']), data)(this.configurations);
		this.pushNewDashboard();
	}

	public handleItemRemove(index: number) {
		this.dashboard.splice(index, 1);
		this.dashboardService.save(this.dashboard).pipe(first()).subscribe();
	}

	public openItemModal(e: Event): void {
		const dialogRef = this.dialog.open(DashboardItemSelectorComponent);

		dialogRef.afterClosed()
			.pipe(first())
			.subscribe((type) => {
				if (!type) {
					return;
				}

				this.dashboard.push({
					x: 0,
					y: 0,
					cols: 6,
					rows: 6,
					type
				});
			});
	}
}
