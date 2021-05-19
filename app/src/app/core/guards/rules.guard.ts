import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { SessionQuery } from '~lib/store';

@Injectable()
export class RulesGuard implements CanActivate {
	constructor(
		public router: Router,
		public sessionQuery: SessionQuery,
	) { }

	async canActivate(): Promise<boolean> {
		// await this.userService.fetchUser();

		// const user = this.userService.user;
		// const tenant = this.userService.tenant;

		// if (!user.rulesAcceptedAt || user.rulesAcceptedAt < tenant.rulesUpdatedAt) {
		// 	 this.router.navigate(['/', 'rules']);
		// 	 return false;
		// }

		return true;
  }}
