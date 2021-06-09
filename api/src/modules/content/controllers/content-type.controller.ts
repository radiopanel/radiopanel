import { Controller, Get, Post, Put, Delete, Headers, Param, Body, UseGuards, Query, UnauthorizedException, Request, ForbiddenException } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";


import { Paginated } from "~shared/types";
import { AuthGuard } from "~shared/guards/auth.guard";
import { Permissions, AuditLog } from "~shared/decorators";
import { ContentTypeService } from "~shared/services/content-type.service";
import { PermissionService } from "~shared/services/permission.service";
import { path, prop } from "ramda";

@Controller('/content-types')
@ApiTags('Content Types')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class ContentTypeController {

	constructor(
		private contentTypeService: ContentTypeService,
		private permissionService: PermissionService,
	) { }

	@Get()
	@Permissions('content-types/read')
	public async find(
		@Query('page') page: number,
		@Query('pagesize') pagesize: number,
		@Query('all') all: string,
	): Promise<Paginated<any>> {
		if (all === "true") {
			// Don't judge haha
			return this.contentTypeService.find(1, 5000);
		}

		return this.contentTypeService.find(page, pagesize);
	}

	@Get('/overview')
	public async findByPermissions(
		@Query('page') page: number,
		@Query('pagesize') pagesize: number,
		@Query('all') all: string,
		@Request() req,
	): Promise<Paginated<any>> {
		const permissions = await this.permissionService.getPermissions(req.user?.uuid);
		const contentPermissions = [...new Set(permissions.filter(x => x.startsWith('content')).map(x => path([1])(x.split('/'))))] as string[];
		
		if (all === "true") {
			// Don't judge haha
			return this.contentTypeService.findByUuids(1, 5000, contentPermissions);
		}

		return this.contentTypeService.findByUuids(page, pagesize, contentPermissions);
	}

	@Get('/:id')
	public async one(@Param('id') id: string, @Request() req): Promise<any | undefined> {
		if (!(
			await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`content/${id}/read`]) || 
			await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`content-types/read`])
		)) {
			throw new ForbiddenException(`Missing permissions: content/${id}/read`)
		}

		return this.contentTypeService.findOne(id);
	}

	@Post()
	@Permissions('content-types/create')
	@AuditLog('content-types/create')
	public create(@Body() contentType: any): Promise<any> {
		return this.contentTypeService.create(contentType);
	}

	@Put('/:id')
	@Permissions('content-types/update')
	@AuditLog('content-types/update')
	public async update(@Param('id') uuid: string, @Body() contentType: any): Promise<any> {
		return this.contentTypeService.update(uuid, contentType);
	}

	@Delete('/:id')
	@Permissions('content-types/delete')
	@AuditLog('content-types/delete')
	public async delete(@Param('id') uuid: string): Promise<void> {
		return this.contentTypeService.delete(uuid);
	}

}
