import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
	HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SessionQuery } from '~lib/store';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(
		private router: Router,
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		request = request.clone({
			setHeaders: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				'X-Tenant': localStorage.getItem('selectedTenant') || 'unset'
			}
		});

		return next.handle(request)
			.pipe(
				tap(
					() => { },
					(err: any) => {
						if (err instanceof HttpErrorResponse) {
							if (err.status !== 401) {
								return;
							}

							localStorage.removeItem('token');
							this.router.navigate(['auth', 'login']);
						}
					}
				)
			);
	}
}
