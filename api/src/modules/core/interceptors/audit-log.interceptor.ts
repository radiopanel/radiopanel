
import { IncomingMessage } from 'http';

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken'
import { pathOr } from 'ramda';

import { AuditLogService } from '~shared/services/audit-log.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
	constructor(
		private reflector: Reflector,
		private auditLogService: AuditLogService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const eventName = this.reflector.get<string>('auditLog', context.getHandler());
		const request = context.switchToHttp().getRequest() as IncomingMessage;
		const body = context.switchToHttp().getRequest()?.body || null;

		if (!eventName) {
			return next.handle();
		}

		const user = jwt.decode(request.headers.authorization.replace('Bearer ', ''));
		const userUuid = pathOr(null, ['user', 'uuid'])(user);

		this.auditLogService.log(userUuid, eventName, body, {
			method: request.method,
			url: request.url,
		});

		return next.handle();
	}
}
