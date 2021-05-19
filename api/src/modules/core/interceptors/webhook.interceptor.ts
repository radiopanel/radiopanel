
import { IncomingMessage } from 'http';

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';

import { WebhookService } from '~shared/services/webhook.service';

@Injectable()
export class WebhookInterceptor implements NestInterceptor {
	constructor(
		private reflector: Reflector,
		private webhookService: WebhookService,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const webhookName = this.reflector.get<string>('webhook', context.getHandler());
		const request = context.switchToHttp().getRequest() as IncomingMessage;

		if (!webhookName) {
			return next.handle();
		}

		return next.handle()
			.pipe(
				map((data) => {
					this.webhookService.executeWebhook(webhookName, data)

					return data;
				})
			)
	}
}
