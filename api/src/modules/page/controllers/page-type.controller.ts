import { Controller, Get, Post, Put, Delete, Headers, Param, Body, UseGuards, Query, UnauthorizedException } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";


import { Paginated } from "~shared/types";
import { AuthGuard } from "~shared/guards/auth.guard";
import { Permissions, AuditLog } from "~shared/decorators";

import { PageTypeService } from "../services/page-type.service";

@Controller('/page-types')
@ApiTags('Page Types')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class PageTypeController {

	constructor(
		private pageTypeService: PageTypeService
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

	@Get('/:id')
	@Permissions('page-types/read')
	public one(@Param('id') id: string): Promise<any | undefined> {
		return this.pageTypeService.findOne(id);
	}

	@Post()
	@Permissions('page-types/create')
	@AuditLog('page-types/create')
	public create(@Body() pageType: any): Promise<any> {
		return this.pageTypeService.create(pageType);
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
