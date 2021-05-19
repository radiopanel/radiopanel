import { Controller, Get, Body, Put, Param, Headers, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '~shared/guards/auth.guard';
import { Permissions, AuditLog } from '~shared/decorators';

import { PageService } from '../services/page.service';


@Controller('/page-types/:pageTypeUuid/page')
@ApiTags('Page')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class PageController {

	constructor(
		private pageService: PageService,
	) { }

	@Get()
	@Permissions('pages/read')
	public async one(
		@Param('pageTypeUuid') pageTypeUuid: string,
	): Promise<any | undefined> {
		return this.pageService.findOne(pageTypeUuid);
	}

	@Put()
	@Permissions('pages/update')
	@AuditLog('page/update')
	public async update(
		@Param('pageTypeUuid') pageTypeUuid: string,
		@Body() page: any,
	): Promise<any> {
		if (!await this.pageService.findOne(pageTypeUuid)) {
			throw new UnauthorizedException()
		}

		return this.pageService.update(pageTypeUuid, {
			...page,
		});
	}
}
