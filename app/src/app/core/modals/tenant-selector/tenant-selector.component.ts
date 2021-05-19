import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SessionQuery } from '~lib/store';
import { Observable } from 'rxjs';
import { Tenant } from '~lib/store/session/session.store';

@Component({
	selector: 'app-tenant-selector',
	templateUrl: 'tenant-selector.component.html',
})
export class TenantSelectorComponent implements OnInit {
	public tenants$: Observable<Tenant[]>;

	constructor(
		public dialogRef: MatDialogRef<TenantSelectorComponent>,
		private sessionQuery: SessionQuery,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { }

	public ngOnInit(): void {
		this.tenants$ = this.sessionQuery.availableTenants$;
	}

	public chooseTenant(e: Event, tenantUuid: string): void {
		e.preventDefault();
		this.dialogRef.close(tenantUuid);
	}

	public close(e: Event): void {
		e.preventDefault();
		this.dialogRef.close();
	}
}
