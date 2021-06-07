import { Controller, Get, Param, Headers, UseGuards, Post, Body, Put, Delete, Query, UnauthorizedException, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { Ban } from '~entities';
import { Paginated } from '~shared/types';
import { Permissions, AuditLog, User } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';
import { BanService } from '~shared/services/ban.service';

@Controller('bans')
@ApiTags('Bans')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class BanController {

	constructor(
		private banService: BanService,
	) { }

	@Get()
	@Permissions('bans/read')
	public async find(@Query('page') page: number, @Query('pagesize') pagesize: number, @Query('search') search: string): Promise<Paginated<Ban> | undefined> {
		return this.banService.find(page, pagesize, search);
	}

	@Get('/:categoryUuid')
	@Permissions('bans/read')
	public async findOne(@Param('categoryUuid') categoryUuid: string): Promise<any> {
		return this.banService.findOne({ uuid: categoryUuid });
	}

	@Post()
	@Permissions('bans/create')
	@AuditLog('bans/create')
	public async create(@Body() category: Ban, @Request() req): Promise<any> {
		return this.banService.create({
			createdByUuid: req.user?.uuid,
			...category,
		});
	}

	@Put('/:categoryUuid')
	@Permissions('bans/update')
	@AuditLog('bans/update')
	public async update(@Param('categoryUuid') uuid: string, @Body() category: Ban): Promise<any> {
		return this.banService.update(uuid, category);
	}

	@Delete('/:categoryUuid')
	@Permissions('bans/update')
	@AuditLog('bans/delete')
	public async delete(@Param('categoryUuid') uuid: string): Promise<any> {
		return this.banService.delete(uuid);
	}
}
