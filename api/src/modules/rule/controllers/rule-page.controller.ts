import { Controller, Get, Param, Headers, UseGuards, Post, Body, Put, Delete, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { RulePage } from '~entities';
import { Paginated } from '~shared/types';
import { Permissions, AuditLog, User } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';

import { RulePageService } from '../services/rule-page.service';

@Controller('rule-pages')
@ApiTags('RulePages')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class RulePageController {

	constructor(
		private rulePageService: RulePageService,
	) { }

	@Get()
	@Permissions('rule-pages/read')
	public async find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<RulePage> | undefined> {
		return this.rulePageService.find(page, pagesize);
	}

	@Get('/:rulePageUuid')
	@Permissions('rule-pages/read')
	public async findOne(@Param('rulePageUuid') rulePageUuid: string): Promise<any> {
		return this.rulePageService.findOne({ uuid: rulePageUuid });
	}

	@Post()
	@Permissions('rule-pages/create')
	@AuditLog('rule-pages/create')
	public async create(@Body() rulePage: RulePage): Promise<any> {
		return this.rulePageService.create(rulePage);
	}

	@Put('/:rulePageUuid')
	@Permissions('rule-pages/update')
	@AuditLog('rule-pages/update')
	public async update(@Param('rulePageUuid') uuid: string, @Body() rulePage: RulePage): Promise<any> {
		if (!await this.rulePageService.findOne({ uuid })) {
			throw new UnauthorizedException()
		}

		return this.rulePageService.update(uuid, {
			...rulePage,
		});
	}

	@Delete('/:rulePageUuid')
	@Permissions('rule-pages/update')
	@AuditLog('rule-pages/delete')
	public async delete(@Param('rulePageUuid') uuid: string): Promise<any> {
		if (!await this.rulePageService.findOne({ uuid })) {
			throw new UnauthorizedException()
		}

		return this.rulePageService.delete(uuid);
	}
}
