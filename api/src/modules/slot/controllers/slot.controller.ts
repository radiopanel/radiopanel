import { Controller, Get, Param, Body, Put, Headers, UseGuards, Post, Query, ForbiddenException, Delete, UnauthorizedException, Request} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { omit, pathOr } from 'ramda';
import moment from 'moment';

import { Permissions, AuditLog } from '~shared/decorators';
import { Slot } from '~entities';
import { Paginated } from '~shared/types';
import { AuthGuard } from '~shared/guards/auth.guard';
import { User } from '~shared/decorators/user.decorator';
import { UserService } from '~shared/services/user.service';
import { SlotService } from '~shared/services/slot.service';
import { PermissionService } from '~shared/services/permission.service';

@Controller('slots')
@ApiTags('Slots')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class SlotController {

	constructor(
		private slotService: SlotService, 
		private userService: UserService,
		private permissionService: PermissionService,
	) { }

	@Get()
	@Permissions('timetable/read')
	public async find(@Query('beforeDate') beforeDate: string, @Query('afterDate') afterDate: string): Promise<Paginated<Slot> | undefined> {
		return this.slotService.find(beforeDate, afterDate);
	}

	@Get('/live')
	@Permissions('timetable/read')
	public async findLive(): Promise<any> {
		const { _embedded: slots } = await this.slotService.find(moment().add(2, 'days').unix().toString(), moment().subtract(2, 'days').unix().toString());

		const currentUnixTime = moment().unix()
		return slots.find((slot: Slot) => currentUnixTime > slot.start && currentUnixTime < slot.end)
	}

	@Get('sync')
	public async sync(@Headers('authorization') authorization: string): Promise<any> {
		this.slotService.sync();
	}

	@Get('/next')
	@Permissions('timetable/read')
	public async findNext(): Promise<any> {
		const { _embedded: slots } = await this.slotService.find(moment().add(7, 'days').unix().toString(), moment().subtract(1, 'days').unix().toString());

		const currentUnixTime = moment().unix()
		return slots.find((slot: Slot) => slot.start > currentUnixTime)
	}

	@Get('next-hours/:hour')
	@Permissions('timetable/read')
	public async findInHour(@Param('hour') hour: string): Promise<any> {
		const { _embedded: slots } = await this.slotService.find(moment().add(7, 'days').unix().toString(), moment().subtract(1, 'days').unix().toString());

		const startOfHour = moment().add(Number(hour), 'hour').startOf('hour').unix();
		const endOfHour = moment().add(Number(hour), 'hour').endOf('hour').unix();
		return pathOr(null, [0])(slots.filter((slot: Slot) => slot.start >= startOfHour && slot.start < endOfHour))
	}

	@Get('/later')
	@Permissions('timetable/read')
	public async findLater(): Promise<any> {
		const { _embedded: slots } = await this.slotService.find(moment().add(7, 'days').unix().toString(), moment().subtract(1, 'days').unix().toString());

		const currentUnixTime = moment().unix()
		return pathOr(null, [1])(slots.filter((slot: Slot) => slot.start > currentUnixTime))
	}

	@Get('/previous')
	@Permissions('timetable/read')
	public async findPrevious(): Promise<any> {
		const { _embedded: slots } = await this.slotService.find(moment().add(1, 'days').unix().toString(), moment().subtract(7, 'days').unix().toString());

		const currentUnixTime = moment().unix();
		const foundSlots = slots.filter((slot: Slot) => slot.end < currentUnixTime);
		return pathOr(null, [foundSlots.length - 1])(foundSlots)
	}

	@Get('/:slotUuid')
	@Permissions('timetable/read')
	public async findOne(@Param('slotUuid') slotUuid: string): Promise<any> {
		return this.slotService.findOne({ uuid: slotUuid });
	}

	@Post()
	@Permissions('timetable/book')
	@AuditLog('timetable/book')
	public async create(@Request() req, @Body() slot: Slot): Promise<any> {
		return await this.slotService.create({
			...slot,
			userUuid: this.permissionService.hasPermission(req.user?.uuid, ['timetable/book-other']) ? slot.userUuid : req.user?.uuid
		});
	}

	@Post('/validate')
	@Permissions('timetable/book')
	public async verify(@Body() slot: Partial<Slot>): Promise<any> {
		return this.slotService.verifyIntegrity(slot);
	}

	@Put('/:slotUuid')
	@Permissions('timetable/book')
	@AuditLog('timetable/update')
	public async update(@Request() req, @Param('slotUuid') slotUuid: string, @Body() slot: Slot): Promise<any> {
		const existingSlot = await this.slotService.findOne({ uuid: slotUuid });
		if (!existingSlot) {
			throw new UnauthorizedException()
		}

		let sanitizedSlot: any = slot;
		if (!this.permissionService.hasPermission(req.user?.uuid, ['timetable/book-other'])) {
			sanitizedSlot = omit(['user', 'userUuid'])(slot);
		}

		if (this.permissionService.hasPermission(req.user?.uuid, ['timetable/update-other'])) {
			return this.slotService.update(slotUuid, sanitizedSlot);
		}

		if (existingSlot.userUuid === req.user?.uuid) {
			return this.slotService.update(slotUuid, sanitizedSlot);
		}

		throw new ForbiddenException();
	}

	@Delete('/:slotUuid')
	@Permissions('timetable/delete-own')
	@AuditLog('timetable/delete')
	public async delete(@Request() req, @Param('slotUuid') slotUuid: string, @Body() body: any): Promise<any> {
		const existingSlot = await this.slotService.findOne({ uuid: slotUuid });
		if (!existingSlot) {
			throw new UnauthorizedException()
		}

		// Check if it is their own slot and they the correct permissions
		if (this.permissionService.hasPermission(req.user?.uuid, ['timetable/delete-own']) && existingSlot.userUuid === req.user?.uuid) {
			if (body.tempDelete) {
				return this.slotService.createOverwrite(existingSlot, body.overwriteDate)
			}

			return this.slotService.delete(slotUuid);
		}

		if (this.permissionService.hasPermission(req.user?.uuid, ['timetable/delete-other'])) {
			if (body.tempDelete) {
				return this.slotService.createOverwrite(existingSlot, body.overwriteDate)
			}

			return this.slotService.delete(slotUuid);
		}

		throw new ForbiddenException();
	}
}
