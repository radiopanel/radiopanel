import { Controller, Get, Post, Put, Delete, Headers, Param, Body, UseGuards, Query, UnauthorizedException } from "@nestjs/common";
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";


import { Paginated } from "~shared/types";
import { AuthGuard } from "~shared/guards/auth.guard";
import { Permissions, AuditLog } from "~shared/decorators";

import { FormService } from "../services/form.service";

@Controller('/forms')
@ApiTags('Forms')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class FormController {

	constructor(
		private formService: FormService
	) { }

	@Get()
	@Permissions('forms/read')
	public find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<any>> {
		return this.formService.find(page, pagesize);
	}

	@Get('/:id')
	@Permissions('forms/read')
	public one(@Param('id') id: string): Promise<any | undefined> {
		return this.formService.findOne(id);
	}

	@Post()
	@Permissions('forms/create')
	@AuditLog('forms/create')
	public create(@Body() form: any): Promise<any> {
		return this.formService.create(form);
	}

	@Put('/:id')
	@Permissions('forms/update')
	@AuditLog('forms/update')
	public async update(@Param('id') uuid: string, @Body() form: any): Promise<any> {
		return this.formService.update(uuid, form);
	}

	@Delete('/:id')
	@Permissions('forms/delete')
	@AuditLog('forms/delete')
	public async delete(@Param('id') uuid: string): Promise<any> {
		if (!await this.formService.findOnePure({ uuid })) {
			throw new UnauthorizedException()
		}

		await this.formService.delete(uuid);
		return {};
	}

}
