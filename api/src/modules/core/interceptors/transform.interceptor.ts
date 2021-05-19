import { IncomingMessage } from 'http';

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { cleanResponse } from '../helpers/cleanResponse';

export interface Response<T> {
  data: T;
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
		const request = context.switchToHttp().getRequest() as IncomingMessage;

		return next.handle().pipe(map(data => {
			return cleanResponse(data, ['password', 'key', 'patreonAccessToken', 'azuraCastApiKey', 'spotifyClientSecret', 'spotifyClientId']);
		}));
	}
}
