import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards, Query, UnauthorizedException } from "@nestjs/common";
import * as uuid from 'uuid'
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";


import { Paginated } from "~shared/types";
import { ApiKey } from "~entities";
import { Permissions, AuditLog } from "~shared/decorators";
import { AuthGuard } from "~shared/guards/auth.guard";
import { ApiKeyService } from "~shared/services/api-key.service";

@Controller('api-keys')
@ApiBasicAuth()
@ApiTags('ApiKeys')
@UseGuards(AuthGuard)
export class ApiKeyController {

	constructor(
		private apiKeyService: ApiKeyService
	) { }

	@Get('sync')
	public async sync(@Headers('authorization') authorization: string): Promise<any> {
		return this.apiKeyService.handleCron();
	}

	@Get()
	@Permissions('api-keys/read')
	public find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<ApiKey>> {
		return this.apiKeyService.find(page, pagesize);
	}

	@Get('/:id')
	@Permissions('api-keys/read')
	public one(@Param('id') id: string): Promise<ApiKey | undefined> {
		return this.apiKeyService.findOne({ uuid: id });
	}

	@Post()
	@Permissions('api-keys/create')
	@AuditLog('api-keys/create')
	public create(@Body() apiKey: ApiKey): Promise<ApiKey> {
		apiKey.uuid = uuid.v4();
		apiKey.createdAt = new Date();
		apiKey.updatedAt = new Date();
		return this.apiKeyService.create(apiKey);
	}

	@Put('/:id')
	@Permissions('api-keys/update')
	@AuditLog('api-keys/update')
	public async update(@Param('id') uuid: string, @Body() apiKey: ApiKey ): Promise<ApiKey> {
		return this.apiKeyService.update(uuid, apiKey);
	}

	@Delete('/:id')
	@Permissions('api-keys/delete')
	@AuditLog('api-keys/delete')
	public async delete(@Param('id') uuid: string ): Promise<void> {
		return this.apiKeyService.delete(uuid);
	}

}
