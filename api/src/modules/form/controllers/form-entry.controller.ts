import { Controller, Get, Body, Query, Post, Put, Delete, Param, Headers, UseGuards, Req, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { Paginated } from '~shared/types';
import { AuthGuard } from '~shared/guards/auth.guard';
import { Permissions, AuditLog, Webhook } from '~shared/decorators';

import { FormEntryService } from '../services/form-entry.service';
import { FormService } from '../services/form.service';


@Controller('/forms/:formUuid/entries')
@ApiTags('FormEntry')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class FormEntryController {

	constructor(
		private formEntryService: FormEntryService,
		private formService: FormService,
	) { }

	@Get()
	@Permissions('form-entries/read')
	public findFormEntries(
		@Query('page') page = 1,
		@Query('pagesize') pagesize = 20,
		@Param('formUuid') formUuid: string,
	): Promise<Paginated<any>> {
		return this.formEntryService.findByForm(formUuid, page, pagesize);
	}

	@Get('/:entryUuid')
	@Permissions('form-entries/read')
	public async one(
		@Param('formUuid') formUuid: string,
		@Param('entryUuid') entryUuid: string,
	): Promise<any | undefined> {
		return this.formEntryService.findOne(formUuid, entryUuid);
	}

	@Post()
	@Webhook('form-entries/create')
	@Permissions('form-entries/create')
	public async create(
		@Param('formUuid') formUuid: string,
		@Body() formEntry: any,
		@Req() req: Request
	): Promise<any> {
		const form = await this.formService.findOne(formUuid);
		const remoteAddress = req.headers['x-forwarded-for'] as string || "internal";

		const existingRequest = await this.formEntryService.findRecent(remoteAddress, form.timeout || 0);

		if (existingRequest) {
			throw new NotAcceptableException("Please wait before sending a new message");
		}

		return this.formEntryService.create(formUuid, {
			...formEntry,
			requestContext: remoteAddress
		});
	}

	@Put('/:entryUuid')
	@Permissions('form-entries/update')
	@AuditLog('form-entries/update')
	public async update(
		@Param('formUuid') formUuid: string,
		@Param('entryUuid') uuid: string,
		@Body() formEntry: any,
	): Promise<any> {
		return this.formEntryService.update(formUuid, uuid, {
			fields: formEntry.fields
		});
	}

	@Delete('/:entryUuid')
	@Permissions('form-entries/delete')
	@AuditLog('form-entries/delete')
	public async delete(
		@Param('formUuid') formUuid: string,
		@Param('entryUuid') uuid: string
	): Promise<void> {
		await this.formEntryService.delete(formUuid, uuid);
		return;
	}

}
