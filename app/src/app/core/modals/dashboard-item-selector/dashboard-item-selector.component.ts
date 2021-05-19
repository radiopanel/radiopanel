import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DASHBOARD_COMPONENTS } from '../../core.conf';
import { map, omit } from 'ramda';

@Component({
	templateUrl: 'dashboard-item-selector.component.html',
})
export class DashboardItemSelectorComponent implements OnInit {
	public items: any[];

	constructor(
		public dialogRef: MatDialogRef<DashboardItemSelectorComponent>
	) { }

	public ngOnInit(): void {
		this.items = map(omit(['component']) as any)(DASHBOARD_COMPONENTS);
	}

	public chooseItem(e: Event, item: string): void {
		e.preventDefault();
		this.dialogRef.close(item);
	}

	public close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}
}
