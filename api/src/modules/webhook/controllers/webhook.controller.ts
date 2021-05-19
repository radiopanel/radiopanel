import { Controller, Get, Param, Headers, UseGuards, Post, Body, Put, Delete, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { Webhook } from '~entities';
import { Paginated } from '~shared/types';
import { Permissions, AuditLog } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';
import { webhooks } from '~shared/webhooks';
import { WebhookService } from '~shared/services/webhook.service';

@Controller('webhooks')
@ApiTags('Webhooks')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class WebhookController {

	constructor(
		private webhookService: WebhookService,
	) { }

	@Get()
	@Permissions('webhooks/read')
	public async find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<Webhook> | undefined> {
		return this.webhookService.find(page, pagesize);
	}

	@Get('/types')
	public async types(): Promise<any> {
		return {
			_embedded: webhooks
		}
	}

	@Get('/destinations')
	public async destinations(): Promise<any> {
		return {
			_embedded: [
				{
					value: "other",
					label: "Other",
				},
				{
					value: "discord",
					label: "Discord",
				}
			]
		}
	}

	@Get('/:webhookUuid')
	@Permissions('webhooks/read')
	public async findOne(@Param('webhookUuid') webhookUuid: string): Promise<any> {
		return this.webhookService.findOne(webhookUuid);
	}

	@Post()
	@Permissions('webhooks/create')
	@AuditLog('webhooks/create')
	public async create(@Body() webhook: Webhook): Promise<any> {
		return this.webhookService.create(webhook);
	}

	@Put('/:webhookUuid')
	@Permissions('webhooks/update')
	@AuditLog('webhooks/update')
	public async update(@Param('webhookUuid') webhookUuid: string, @Body() webhook: Webhook): Promise<any> {
		if (!await this.webhookService.findOne(webhookUuid)) {
			throw new UnauthorizedException()
		}

		return this.webhookService.update(webhookUuid, webhook);
	}

	@Delete('/:webhookUuid')
	@Permissions('webhooks/delete')
	@AuditLog('webhooks/delete')
	public async delete(@Param('webhookUuid') webhookUuid: string): Promise<any> {
		if (!await this.webhookService.findOne(webhookUuid)) {
			throw new UnauthorizedException()
		}

		return this.webhookService.delete(webhookUuid);
	}
}
