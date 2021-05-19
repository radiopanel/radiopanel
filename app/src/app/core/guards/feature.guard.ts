import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from '../services';

@Injectable()
export class FeatureGuard implements CanActivate {
	constructor(
		public router: Router,
		public authService: AuthService,
	) { }

	async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
		const featureSlug = route.data.requiresFeature as string;
		return this.authService.hasFeatureAccess(featureSlug);
  }}
