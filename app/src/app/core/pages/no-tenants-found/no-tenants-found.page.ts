import { Component } from '@angular/core';

import { AuthService } from '../../services';

@Component({
	templateUrl: './no-tenants-found.page.html'
})
export class NoTenantsFoundPageComponent {
	constructor(
		private authService: AuthService,
	) { }

	public logout(): void {
		this.authService.logout();
	}
}
