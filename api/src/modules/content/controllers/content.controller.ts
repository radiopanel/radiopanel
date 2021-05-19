import { Controller, Get, Body, Post, Put, Delete, Param, Headers, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { Paginated } from '~shared/types';
import { AuthGuard } from '~shared/guards/auth.guard';
import { Permissions, AuditLog } from '~shared/decorators';

import { ContentService } from '../services/content.service';
import { ContentTypeService } from '../services/content-type.service';


@Controller('/content-types/:contentTypeUuid/content')
@ApiTags('Content')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class ContentController {

	constructor(
		private contentService: ContentService,
		private contentTypeService: ContentTypeService,
	) { }

	@Get()
	@Permissions('content/read')
	public findContentTypeEntries(
		@Query('page') page = 1,
		@Query('pagesize') pagesize = 20,
		@Query('search') search: string,
		@Param('contentTypeUuid') contentTypeUuid: string,
	): Promise<Paginated<any>> {
		return this.contentService.findByContentType(contentTypeUuid, page, pagesize, search);
	}

	@Get('/:entryUuid')
	@Permissions('content/read')
	public async one(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Param('entryUuid') entryUuid: string,
	): Promise<any | undefined> {
		return this.contentService.findOne(contentTypeUuid, entryUuid);
	}

	@Post()
	@Permissions('content/create')
	public async create(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Body() content: any,
	): Promise<any> {
		return this.contentService.create(contentTypeUuid, content);
	}

	@Put('/:entryUuid')
	@Permissions('content/update')
	@AuditLog('content/update')
	public async update(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Param('entryUuid') uuid: string,
		@Body() content: any,
	): Promise<any> {
		return this.contentService.update(contentTypeUuid, uuid, content);
	}

	@Delete('/:entryUuid')
	@Permissions('content/delete')
	@AuditLog('content/delete')
	public async delete(
		@Param('contentTypeUuid') contentTypeUuid: string,
		@Param('entryUuid') uuid: string
	): Promise<void> {
		return await this.contentService.delete(contentTypeUuid, uuid);
	}

}
