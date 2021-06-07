import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
	HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '')  + expires + '; path=/';
};

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
	constructor(
		private router: Router,
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request)
			.pipe(
				tap(
					() => { },
					(err: any) => {
						if (err instanceof HttpErrorResponse) {
							if (err.status !== 401) {
								return;
							}

							setCookie('loggedIn', 'false', 0);
							this.router.navigate(['auth', 'login']);
						}
					}
				)
			);
	}
}
