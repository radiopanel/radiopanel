import { Controller, Get, Param, Headers, UseGuards, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuditLog } from '~entities';
import { Paginated } from '~shared/types';
import { AuthGuard } from '~shared/guards/auth.guard';
import { AuditLogService } from '~shared/services/audit-log.service';
import { Permissions } from '~shared/decorators';

@Controller('audit-log')
@ApiBasicAuth()
@ApiTags('AuditLogs')
@UseGuards(AuthGuard)
export class AuditLogController {

	constructor(
		private auditLogService: AuditLogService,
	) { }

	@Get()
	@Permissions('audit-log/read')
	public async find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<AuditLog> | undefined> {
		return this.auditLogService.find(page, pagesize);
	}

	@Get('/:auditLogUuid')
	@Permissions('audit-log/read')
	public async findOne(@Param('auditLogUuid') auditLogUuid: string): Promise<any> {
		return this.auditLogService.findOne(auditLogUuid);
	}
}
