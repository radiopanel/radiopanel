import { Controller, Get, Param, Body, Put, UseGuards, Post, Query, ForbiddenException, Delete, UnauthorizedException, Request} from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { omit, pathOr } from 'ramda';
import moment from 'moment';

import { Permissions, AuditLog } from '~shared/decorators';
import { Slot } from '~entities';
import { Paginated } from '~shared/types';
import { AuthGuard } from '~shared/guards/auth.guard';
import { SlotService } from '~shared/services/slot.service';
import { PermissionService } from '~shared/services/permission.service';
import { PopulationService } from '~shared/services/population.service';
import { TenantService } from '~shared/services/tenant.service';

@Controller('slots')
@ApiTags('Slots')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class SlotController {

	constructor(
		private slotService: SlotService, 
		private permissionService: PermissionService,
		private populateService: PopulationService,
		private tenantService: TenantService,
	) { }

	@Get()
	@Permissions('timetable/read')
	public async find(
		@Query('populate') populate = false,
		@Query('beforeDate') beforeDate: string,
		@Query('afterDate') afterDate: string,
	): Promise<Paginated<Slot> | undefined> {
		const [slots, tenant] = await Promise.all([
			this.slotService.find(beforeDate, afterDate),
			this.tenantService.findOne()
		]);
		
		if (!populate || !tenant.slotFields || !tenant.slotFields.length) {
			return slots;
		}

		return {
			...slots,
			_embedded: await Promise.all(slots._embedded.map(async (slot) => ({
				...slot,
				customData: await this.populateService.populateContent(slot.customData, tenant.slotFields),
			})))
		}
	}

	@Get('/live')
	@Permissions('timetable/read')
	public async findLive(
		@Query('populate') populate = false,
	): Promise<any> {
		const [{ _embedded: slots }, tenant] = await Promise.all([
			this.slotService.find(moment().add(2, 'days').unix().toString(), moment().subtract(2, 'days').unix().toString()),
			this.tenantService.findOne()
		]);

		const currentUnixTime = moment().unix()
		const slot = slots.find((slot: Slot) => currentUnixTime > slot.start && currentUnixTime < slot.end);

		if (!slot) {
			return null;
		}
		
		if (!populate || !tenant.slotFields || !tenant.slotFields.length) {
			return slot;
		}

		return {
			...slot,
			customData: await this.populateService.populateContent(slot.customData, tenant.slotFields),
		}
	}

	@Get('sync')
	public async sync(): Promise<any> {
		this.slotService.sync();
	}

	@Get('/next')
	@Permissions('timetable/read')
	public async findNext(
		@Query('populate') populate = false,
	): Promise<any> {
		const [{ _embedded: slots }, tenant] = await Promise.all([
			this.slotService.find(moment().add(7, 'days').unix().toString(), moment().subtract(1, 'days').unix().toString()),
			this.tenantService.findOne()
		]);

		const currentUnixTime = moment().unix()
		const slot = slots.find((slot: Slot) => slot.start > currentUnixTime)

		if (!slot) {
			return null;
		}
		
		if (!populate || !tenant.slotFields || !tenant.slotFields.length) {
			return slot;
		}

		return {
			...slot,
			customData: await this.populateService.populateContent(slot.customData, tenant.slotFields),
		}
	}

	@Get('next-hours/:hour')
	@Permissions('timetable/read')
	public async findInHour(
		@Query('populate') populate = false,
		@Param('hour') hour: string,
	): Promise<any> {
		const [{ _embedded: slots }, tenant] = await Promise.all([
			this.slotService.find(moment().add(7, 'days').unix().toString(), moment().subtract(1, 'days').unix().toString()),
			this.tenantService.findOne(),
		]);

		const startOfHour = moment().add(Number(hour), 'hour').startOf('hour').unix();
		const endOfHour = moment().add(Number(hour), 'hour').endOf('hour').unix();
		const slot = pathOr(null, [0])(slots.filter((slot: Slot) => slot.start >= startOfHour && slot.start < endOfHour))

		if (!slot) {
			return null;
		}
		
		if (!populate || !tenant.slotFields || !tenant.slotFields.length) {
			return slot;
		}

		return {
			...slot,
			customData: await this.populateService.populateContent(slot.customData, tenant.slotFields),
		}
	}

	@Get('/later')
	@Permissions('timetable/read')
	public async findLater(
		@Query('populate') populate = false,
	): Promise<any> {
		const [{ _embedded: slots }, tenant] = await Promise.all([
			this.slotService.find(moment().add(7, 'days').unix().toString(), moment().subtract(1, 'days').unix().toString()),
			this.tenantService.findOne()
		]);

		const currentUnixTime = moment().unix()
		const slot = pathOr(null, [1])(slots.filter((slot: Slot) => slot.start > currentUnixTime))

		if (!slot) {
			return null;
		}
		
		if (!populate || !tenant.slotFields || !tenant.slotFields.length) {
			return slot;
		}

		return {
			...slot,
			customData: await this.populateService.populateContent(slot.customData, tenant.slotFields),
		}
	}

	@Get('/previous')
	@Permissions('timetable/read')
	public async findPrevious(
		@Query('populate') populate = false,
	): Promise<any> {
		const [{ _embedded: slots }, tenant] = await Promise.all([
			this.slotService.find(moment().add(1, 'days').unix().toString(), moment().subtract(7, 'days').unix().toString()),
			this.tenantService.findOne()
		]);

		const currentUnixTime = moment().unix();
		const foundSlots = slots.filter((slot: Slot) => slot.end < currentUnixTime);
		const slot = pathOr(null, [foundSlots.length - 1])(foundSlots)

		if (!slot) {
			return null;
		}
		
		if (!populate || !tenant.slotFields || !tenant.slotFields.length) {
			return slot;
		}

		return {
			...slot,
			customData: await this.populateService.populateContent(slot.customData, tenant.slotFields),
		}
	}

	@Get('/:slotUuid')
	@Permissions('timetable/read')
	public async findOne(
		@Query('populate') populate = false,
		@Param('slotUuid') slotUuid: string, 
	): Promise<any> {
		const [slot, tenant] = await Promise.all([
			this.slotService.findOne({ uuid: slotUuid }),
			this.tenantService.findOne()
		]);

		if (!slot) {
			return null;
		}
		
		if (!populate || !tenant.slotFields || !tenant.slotFields.length) {
			return slot;
		}

		return {
			...slot,
			customData: await this.populateService.populateContent(slot.customData, tenant.slotFields),
		}
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
