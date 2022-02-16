import { Controller, Get, Body, Put, Param, Headers, UseGuards, UnauthorizedException, Request, ForbiddenException, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '~shared/guards/auth.guard';
import { Permissions, AuditLog } from '~shared/decorators';

import { PageService } from '../services/page.service';
import { PermissionService } from '~shared/services/permission.service';


@Controller('/page-types/:pageTypeUuid/page')
@ApiTags('Page')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class PageController {

	constructor(
		private pageService: PageService,
		private permissionService: PermissionService,
	) { }

	@Get()
	public async one(
		@Param('pageTypeUuid') pageTypeUuid: string,
		@Query('populate') populate: string,
		@Request() req,
	): Promise<any | undefined> {
		if (!await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`pages/${pageTypeUuid}/read`])) {
			throw new ForbiddenException(`Missing permissions: pages/${pageTypeUuid}/read`)
		}

		return this.pageService.findOne(pageTypeUuid, populate === "true");
	}

	@Put()
	@AuditLog('page/update')
	public async update(
		@Param('pageTypeUuid') pageTypeUuid: string,
		@Body() page: any,
		@Request() req,
	): Promise<any> {
		if (!await this.pageService.findOne(pageTypeUuid)) {
			throw new UnauthorizedException()
		}

		if (!await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`pages/${pageTypeUuid}/update`])) {
			throw new ForbiddenException(`Missing permissions: pages/${pageTypeUuid}/update`)
		}

		return this.pageService.update(pageTypeUuid, {
			...page,
			updatedByUuid: req.user?.uuid
		});
	}
}
