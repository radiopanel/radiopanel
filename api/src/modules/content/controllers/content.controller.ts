import { Controller, Get, Body, Post, Put, Delete, Param, Query, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { Paginated } from '~shared/types';
import { AuthGuard } from '~shared/guards/auth.guard';
import { AuditLog, Webhook } from '~shared/decorators';
import { PermissionService } from '~shared/services/permission.service';

import { ContentService } from '../services/content.service';


@Controller('/content-types/:contentTypeUuid/content')
@ApiTags('Content')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class ContentController {

	constructor(
		private contentService: ContentService,
		private permissionService: PermissionService,
	) { }

	@Get()
	public async findContentTypeEntries(
		@Query('page') page = 1,
		@Query('pagesize') pagesize = 20,
		@Query('sort') sort: string,
		@Query('showUnpublished') showUnpublished: string,
		@Query() allParams: Record<string, string>,
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Request() req,
	): Promise<Paginated<any>> {
		if (!await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`content/${contentTypeUuid}/read`])) {
			throw new ForbiddenException(`Missing permissions: content/${contentTypeUuid}/read`)
		}

		return this.contentService.findByContentType(contentTypeUuid, page, pagesize, allParams, showUnpublished === 'true', sort?.replace('-', ''), sort?.startsWith('-') ? 'DESC' : 'ASC');
	}

	@Get('/:entryUuid')
	public async one(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Param('entryUuid') entryUuid: string,
		@Query('populate') populate: string,
		@Request() req,
	): Promise<any | undefined> {
		if (!await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`content/${contentTypeUuid}/read`])) {
			throw new ForbiddenException(`Missing permissions: content/${contentTypeUuid}/read`)
		}

		return this.contentService.findOne(contentTypeUuid, entryUuid, populate === "true");
	}

	@Post()
	@Webhook('content/create')
	public async create(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Body() content: any,
		@Request() req,
	): Promise<any> {
		if (!await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`content/${contentTypeUuid}/create`])) {
			throw new ForbiddenException(`Missing permissions: content/${contentTypeUuid}/create`)
		}

		return this.contentService.create(contentTypeUuid, {
			...content,
			updatedByUuid: req.user?.uuid,
			createdByUuid: req.user?.uuid
		});
	}

	@Put('/:entryUuid')
	@AuditLog('content/update')
	public async update(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Param('entryUuid') uuid: string,
		@Body() content: any,
		@Request() req,
	): Promise<any> {
		if (!await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`content/${contentTypeUuid}/update`])) {
			throw new ForbiddenException(`Missing permissions: content/${contentTypeUuid}/update`)
		}

		return this.contentService.update(contentTypeUuid, uuid, {
			...content,
			updatedByUuid: req.user?.uuid
		});
	}

	@Delete('/:entryUuid')
	@AuditLog('content/delete')
	public async delete(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Param('entryUuid') uuid: string,
		@Request() req,
	): Promise<void> {
		if (!await this.permissionService.hasPermission(req.user?.uuid || req.headers.authorization, [`content/${contentTypeUuid}/delete`])) {
			throw new ForbiddenException(`Missing permissions: content/${contentTypeUuid}/delete`)
		}

		return await this.contentService.delete(contentTypeUuid, uuid);
	}

}
