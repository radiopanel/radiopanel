import { IncomingMessage } from 'http';

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionService } from '~shared/services/permission.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private permissionService: PermissionService,
		private reflector: Reflector,
	) {}

	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		const request = context.switchToHttp().getRequest() as IncomingMessage & { user: any };
		const permissions = this.reflector.get<string[]>('permissions', context.getHandler());

		try {
			const hasPermission = await this.permissionService.hasPermission(request.user?.uuid || request.headers.authorization, permissions)

			if (!hasPermission) {
				throw new ForbiddenException(`Missing permissions: ${permissions.join(", ")}`)
			}
		} catch (e) {
			throw e;
		}

		return true;
	}
}
