import { ToastrService } from 'ngx-toastr';
import { throwError, merge, of, forkJoin } from 'rxjs';
import { catchError, tap, first, switchMap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SessionService, SessionQuery } from '~lib/store';
import { SocketService } from './socket.service';
import { Router, ActivatedRoute } from '@angular/router';

const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
};

const getCookie = (name) => {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') { c = c.substring(1, c.length); }
        if (c.indexOf(nameEQ) == 0) { return c.substring(nameEQ.length, c.length); }
    }
    return null;
};

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
					this.sessionService.updateUser(result.user);
					this.sessionService.updatePermissions(result.permissions);
					this.sessionService.updateTenantMessages(result.tenantMessages);
					this.sessionService.updateTenant(result.tenant);

					const style = document.createElement('style');
					style.id = 'customCss';
					document.head.append(style);
					style.textContent = result.tenant?.settings?.customCSS;
					document.documentElement.style.setProperty('--color-primary', result.tenant?.settings?.primaryColor || '#FF926B');

					this.fetchMisc();

					return of({});
				}),
				first()
			).toPromise();

		return;
	}

	public fetchMisc(): void {
		this.sessionService.fetchPageTypes()
			.pipe(first()).subscribe();

		this.sessionService.fetchContentTypes()
			.pipe(first()).subscribe();
	}

	public bootstrapListeners() {
		this.socketService.socket.on('tenant-updated', async () => {
			this.fetchSessionData();
		});

		this.socketService.socket.on('role-updated', () => {
			this.fetchSessionData();
		});

		this.socketService.socket.on('page-types_updated', () => {
			this.sessionService.fetchPageTypes()
				.pipe(first()).subscribe();
		});

		this.socketService.socket.on('content-types_updated', () => {
			this.sessionService.fetchContentTypes()
				.pipe(first()).subscribe();
		});

		this.socketService.socket.on('user-role-updated', () => {
			this.fetchSessionData();
		});
	}

	public isAuthenticated(): boolean {
		return getCookie('loggedIn') === 'true';
	}

	public login(values) {
		return this.http.post<any>('/api/v1/auth/login/local', values)
			.pipe(
				tap(async () => {
					setCookie('loggedIn', 'true', 50);
					await this.fetchSessionData();
				})
			);
	}

	public register(values) {
		return this.http.post<any>('/api/v1/auth/register', values)
			.pipe(
				tap(async () => {
					setCookie('loggedIn', 'true', 50);
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
		this.http.post<any>('/api/v1/auth/logout', {})
			.pipe(
				tap(() => {
					localStorage.removeItem('AkitaStores');
					setCookie('loggedIn', 'false', 0);
					this.router.navigate(['/', 'auth', 'login']);
					this.toastr.success('Logged out successfully');
				}),
				first()
			).subscribe();
	}
}
