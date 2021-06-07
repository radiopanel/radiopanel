import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		public auth: AuthService,
		public router: Router,
	) { }

	async canActivate(): Promise<boolean> {
		if (!this.auth.isAuthenticated()) {
			this.router.navigate(['auth', 'login']);
			return false;
		}

		return true;
	}
}
