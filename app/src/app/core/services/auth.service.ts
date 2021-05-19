import { ToastrService } from 'ngx-toastr';
import { prop, path, propOr, pathOr } from 'ramda';
import { throwError, merge, of, forkJoin } from 'rxjs';
import { catchError, tap, first, switchMap } from 'rxjs/operators';
import * as ioClient from 'socket.io-client';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SessionService, SessionQuery } from '~lib/store';
import { SocketService } from './socket.service';
import { Tenant } from '~lib/store/session/session.store';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class AuthService {
	public availableTenants: any;
	public permissions: any;

	constructor(
		private jwtHelper: JwtHelperService,
		private http: HttpClient,
		private toastr: ToastrService,
		private sessionService: SessionService,
		private sessionQuery: SessionQuery,
		private socketService: SocketService,
		private router: Router,
	) {
		console.log('construct');
		this.fetchSessionData();
		this.socketService.bootstrapSockets();
		this.bootstrapListeners();
	}

	public async fetchSessionData(): Promise<void> {
		if (!this.isAuthenticated()) {
			return;
		}

		await this.http.get<any>('/api/v1/auth/user')
			.pipe(
				switchMap((result) => {
					console.log(result);
					this.sessionService.updateUser(result.user);
					this.sessionService.updatePermissions(result.permissions);
					this.sessionService.updateTenantMessages(result.tenantMessages);
					this.sessionService.updateTenant(result.tenant);

					if (result.permissions.includes('content-types/read') || result.permissions.includes('page-types/read')) {
						return forkJoin([
							...(result.permissions.includes('content-types/read') ? [this.sessionService.fetchContentTypes()] : []),
							...(result.permissions.includes('page-types/read') ? [this.sessionService.fetchPageTypes()] : []),
						]);
					}

					const style = document.createElement('style');
					style.id = 'customCss';
					document.head.append(style);
					style.textContent = result.tenant?.settings?.customCSS;
					document.documentElement.style.setProperty('--color-primary', result.tenant?.settings?.primaryColor || '#FF926B');

					this.sessionService.updateFeatures(result.tenant?.features.reduce((acc, feature) => {
						if (!path(['feature', 'slug'])(feature)) {
							return acc;
						}

						return [...acc, feature.feature.slug];
					}, []));

					return of({});
				}),
				first()
			).toPromise();

		return;
	}

	public bootstrapListeners() {
		this.socketService.socket.on('tenant-updated', async () => {
			this.fetchSessionData();
		});

		this.socketService.socket.on('role-updated', () => {
			this.fetchSessionData();
		});

		this.socketService.socket.on('user-role-updated', () => {
			this.fetchSessionData();
		});
	}

	public isAuthenticated(): boolean {
		const token = localStorage.getItem('token');
		return !this.jwtHelper.isTokenExpired(token);
	}

	public login(values) {
		return this.http.post<any>('/api/v1/auth/login', values)
			.pipe(
				tap(async (result) => {
					localStorage.setItem('token', result.token);
					await this.fetchSessionData();
				})
			);
	}

	public register(values) {
		return this.http.post<any>('/api/v1/auth/register', values)
			.pipe(
				tap(async (result) => {
					localStorage.setItem('token', result.token);
					await this.fetchSessionData();
				})
			);
	}

	public requestPasswordReset(values: any) {
		return this.http.post<any>('/api/v1/auth/password-reset', values);
	}

	public hasFeatureAccess(featureSlug: string): boolean {
		return !!(this.sessionQuery.getValue().tenant.features || [])
			.find((feature) => feature.feature.slug === featureSlug && !feature.deletedAt);
	}

	public logout() {
		localStorage.removeItem('token');
		localStorage.removeItem('AkitaStores');
		localStorage.removeItem('selectedTenant');
		this.router.navigate(['/', 'auth', 'login']);
		this.toastr.success('Logged out successfully');
	}
}
