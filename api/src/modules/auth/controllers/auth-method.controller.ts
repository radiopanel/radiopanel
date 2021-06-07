import { Controller, Get, Param, Headers, UseGuards, Post, Body, Put, Delete, Query, UnauthorizedException, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuthenticationMethod } from '~entities';
import { Paginated } from '~shared/types';
import { Permissions, AuditLog } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';
import { AuthMethodService } from '~shared/services/auth-method.service';

@Controller('authentication-methods')
@ApiTags('Authentication Methods')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class AuthMethodController {

	constructor(
		private authMethodService: AuthMethodService,
	) { }

	@Get()
	@Permissions('authentication-methods/read')
	public async find(@Query('page') page: number, @Query('pagesize') pagesize: number): Promise<Paginated<AuthenticationMethod> | undefined> {
		return this.authMethodService.find(page, pagesize);
	}

	@Get('/:authenticationMethodUuid')
	@Permissions('authentication-methods/read')
	public async findOne(@Param('authenticationMethodUuid') authenticationMethodUuid: string): Promise<any> {
		return this.authMethodService.findOne({ uuid: authenticationMethodUuid });
	}

	@Post()
	@Permissions('authentication-methods/create')
	@AuditLog('authentication-methods/create')
	public async create(@Body() authMethod: AuthenticationMethod): Promise<any> {
		return this.authMethodService.create(authMethod);
	}

	@Put('/:authenticationMethodUuid')
	@Permissions('authentication-methods/update')
	@AuditLog('authentication-methods/update')
	public async update(@Param('authenticationMethodUuid') uuid: string, @Body() authMethod: AuthenticationMethod): Promise<any> {
		return this.authMethodService.update(uuid, authMethod);
	}

	@Delete('/:authenticationMethodUuid')
	@Permissions('authentication-methods/update')
	@AuditLog('authentication-methods/delete')
	public async delete(@Param('authenticationMethodUuid') uuid: string): Promise<any> {
		return this.authMethodService.delete(uuid);
	}
}
