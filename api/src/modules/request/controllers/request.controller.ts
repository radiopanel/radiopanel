import { Controller, Get, Param, Headers, UseGuards, Body, Delete, Post, Req, NotAcceptableException, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { IsNull, MoreThan } from 'typeorm';

import { Request as RequestEntity } from '~entities';
import { Paginated } from '~shared/types';
import { Permissions, AuditLog } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';
import { PermissionService } from '~shared/services/permission.service';
import { BanService } from '~shared/services/ban.service';

import { RequestService } from '../services/request.service';

@Controller('requests')
@ApiTags('Requests')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class RequestController {

	constructor(
		private requestService: RequestService,
		private banService: BanService,
		private permissionService: PermissionService,
	) { }

	@Get()
	@Permissions('requests/read')
	public async find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<RequestEntity> | undefined> {
		return this.requestService.find(page, pagesize);
	}

	@Get('/:requestUuid')
	@Permissions('requests/read')
	public async findOne(@Param('requestUuid') requestUuid: string): Promise<any> {
		return this.requestService.findOne({ uuid: requestUuid });
	}

	@Post()
	@Permissions('requests/create')
	public async create(
		@Headers('authorization') authorization: string,
		@Body() request: RequestEntity,
		@Req() req: Request
	): Promise<any> {
		const remoteAddress = req.headers['x-real-ip'] as string || "internal";

		// first of all check for ban
		if (await this.banService.findOne({
			where: [
				{ identifier: remoteAddress, expiresAt: MoreThan(new Date()) },
				{ identifier: remoteAddress, expiresAt: IsNull()  }
			]
		})) {
			throw new NotAcceptableException('You have been banned from this radio');
		}

		if (await this.permissionService.hasPermission((req.user as any)?.uuid || req.headers.authorization, ['requests/ignore-timeout'])) {
			return this.requestService.create({
				requestOrigin: 'website',
				...request,
				requestContext: remoteAddress
			});
		}

		if (await this.requestService.findRecent(remoteAddress)) {
			throw new NotAcceptableException('Please wait before making another request');
		}

		return this.requestService.create({
			requestOrigin: 'website',
			...request,
			requestContext: remoteAddress
		});
	}

	@Delete('/:requestUuid')
	@Permissions('requests/delete')
	@AuditLog('requests/delete')
	public async delete(@Param('requestUuid') uuid: string): Promise<any> {
		if (!await this.requestService.findOne({ uuid })) {
			throw new UnauthorizedException()
		}

		return this.requestService.delete(uuid);
	}

	@Delete()
	@Permissions('requests/delete')
	@AuditLog('requests/delete')
	public async clear(): Promise<any> {
		return this.requestService.clear();
	}
}
