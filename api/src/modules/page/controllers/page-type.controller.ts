import { Controller, Get, Post, Put, Delete, Headers, Param, Body, UseGuards, Query, UnauthorizedException, Request, ForbiddenException } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";

import { Paginated } from "~shared/types";
import { AuthGuard } from "~shared/guards/auth.guard";
import { Permissions, AuditLog } from "~shared/decorators";
import { PageTypeService } from "~shared/services/page-type.service";
import { PermissionService } from "~shared/services/permission.service";
import { path } from "ramda";

@Controller('/page-types')
@ApiTags('Page Types')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class PageTypeController {

	constructor(
		private pageTypeService: PageTypeService,
		private permissionService: PermissionService,
	) { }

	@Get()
	@Permissions('page-types/read')
	public find(@Query('page') page, @Query('pagesize') pagesize, @Query('all') all): Promise<Paginated<any>> {
		if (all === "true") {
			// Don't judge haha
			return this.pageTypeService.find(1, 5000);
		}
		return this.pageTypeService.find(page, pagesize);
	}

	@Get('/overview')
	public async findByPermissions(
		@Query('page') page: number,
		@Query('pagesize') pagesize: number,
		@Query('all') all: string,
		@Request() req,
	): Promise<Paginated<any>> {
		const permissions = await this.permissionService.getPermissions(req.user?.uuid);
		const contentPermissions = [...new Set(permissions.filter(x => x.startsWith('pages')).map(x => path([1])(x.split('/'))))] as string[];
		
		if (all === "true") {
			// Don't judge haha
			return this.pageTypeService.findByUuids(1, 5000, contentPermissions);
		}

		return this.pageTypeService.findByUuids(page, pagesize, contentPermissions);
	}

	@Get('/:id')
	public async one(@Param('id') id: string, @Request() req): Promise<any | undefined> {
		if (!(
			await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`pages/${id}/read`]) || 
			await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`page-types/read`])
		)) {
			throw new ForbiddenException(`Missing permissions: pages/${id}/read`)
		}

		return this.pageTypeService.findOne(id);
	}

	@Post()
	@Permissions('page-types/create')
	@AuditLog('page-types/create')
	public create(@Body() pageType: any, @Request() req): Promise<any> {
		return this.pageTypeService.create(pageType, req.user?.uuid);
	}

	@Put('/:id')
	@Permissions('page-types/update')
	@AuditLog('page-types/update')
	public async update(@Param('id') uuid: string, @Body() pageType: any): Promise<any> {
		if (!await this.pageTypeService.findOnePure({ uuid })) {
			throw new UnauthorizedException()
		}

		return this.pageTypeService.update(uuid, {
			...pageType,
		});
	}

	@Delete('/:id')
	@Permissions('page-types/delete')
	@AuditLog('page-types/delete')
	public async delete(@Param('id') uuid: string): Promise<any> {
		if (!await this.pageTypeService.findOnePure({ uuid })) {
			throw new UnauthorizedException()
		}

		await this.pageTypeService.delete(uuid);
		return {};
	}

}
