import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { pathOr } from 'ramda';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	constructor(
		private toastr: ToastrService
	) {}

	intercept(
		request: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((error: HttpErrorResponse) => {
				this.toastr.error(pathOr('Something went wrong while trying to do that', ['error', 'message'])(error), 'Error');
				return throwError(error);
			})
		);
	}
}
