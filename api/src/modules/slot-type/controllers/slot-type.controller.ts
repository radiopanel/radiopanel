import { Controller, Get, Param, Headers, UseGuards, Post, Body, Put, Delete, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { SlotType } from '~entities';
import { Paginated } from '~shared/types';
import { Permissions, AuditLog } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';

import { SlotTypeService } from '../services/slot-type.service';

@Controller('slot-types')
@ApiTags('SlotTypes')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class SlotTypeController {

	constructor(
		private slotTypeService: SlotTypeService,
	) { }

	@Get()
	@Permissions('slot-types/read')
	public async find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<SlotType> | undefined> {
		return this.slotTypeService.find(page, pagesize);
	}

	@Get('/:slotTypeUuid')
	@Permissions('slot-types/read')
	public async findOne(@Param('slotTypeUuid') slotTypeUuid: string): Promise<any> {
		return this.slotTypeService.findOne({ uuid: slotTypeUuid });
	}

	@Post()
	@Permissions('slot-types/create')
	@AuditLog('slot-types/create')
	public async create(@Body() slotType: SlotType): Promise<any> {
		return this.slotTypeService.create(slotType);
	}

	@Put('/:slotTypeUuid')
	@Permissions('slot-types/update')
	@AuditLog('slot-types/update')
	public async update(@Param('slotTypeUuid') uuid: string, @Body() slotType: SlotType): Promise<any> {
		return this.slotTypeService.update(uuid, slotType);
	}

	@Delete('/:slotTypeUuid')
	@Permissions('slot-types/update')
	@AuditLog('slot-types/delete')
	public async delete(@Param('slotTypeUuid') uuid: string): Promise<void> {
		return this.slotTypeService.delete(uuid);
	}
}
