import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services';
import { SessionQuery } from '~lib/store';
import { MatDialog } from '@angular/material/dialog';
import { QuickAccessModalComponent } from '../../modals';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-wrapper',
	templateUrl: './wrapper.component.html'
})
export class WrapperComponent implements OnInit {
	public user: any;
	public tenantMessages$: Observable<any[]>;
	public availableTenants = [];

	constructor(
		public authService: AuthService,
		public sessionQuery: SessionQuery,
		private router: Router,
		private dialog: MatDialog,
	) { }

	public handleQuickAccess(e: Event): void {
		e.preventDefault();
		const dialog = this.dialog.open(QuickAccessModalComponent);
	}

	public ngOnInit(): void {
		this.user = this.sessionQuery.user$;
		this.tenantMessages$ = this.sessionQuery.tenantMessages$;
		this.availableTenants = this.authService.availableTenants;
	}

	public deleteMessage(e: Event, messageUuid: string): void {
		e.preventDefault();

		// this.authService.deleteMessage(messageUuid);
	}

	public handleTenantChange(tenantUuid: string) {
		// this.authService.selectTenant(tenantUuid);
	}

	public handleLogout() {
		this.authService.logout();
		this.router.navigate(['auth', 'login']);
	}
}
