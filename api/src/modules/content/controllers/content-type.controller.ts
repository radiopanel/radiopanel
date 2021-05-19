import { Controller, Get, Post, Put, Delete, Headers, Param, Body, UseGuards, Query, UnauthorizedException } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";


import { Paginated } from "~shared/types";
import { AuthGuard } from "~shared/guards/auth.guard";
import { Permissions, AuditLog } from "~shared/decorators";

import { ContentTypeService } from "../services/content-type.service";

@Controller('/content-types')
@ApiTags('Content Types')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class ContentTypeController {

	constructor(
		private contentTypeService: ContentTypeService
	) { }

	@Get()
	@Permissions('content-types/read')
	public find(@Query('page') page: number, @Query('pagesize') pagesize: number, @Query('all') all: string): Promise<Paginated<any>> {
		if (all === "true") {
			// Don't judge haha
			return this.contentTypeService.find(1, 5000);
		}

		return this.contentTypeService.find(page, pagesize);
	}

	@Get('/:id')
	@Permissions('content-types/read')
	public one(@Param('id') id: string): Promise<any | undefined> {
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
