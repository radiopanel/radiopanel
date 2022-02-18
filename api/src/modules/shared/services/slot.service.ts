import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, Brackets } from "typeorm";
import moment from "moment";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";

import { Slot, Tenant, SlotOverwrite } from "~entities";
import { Paginated } from "~shared/types";

import { TenantService } from "./tenant.service";
import { WebhookService } from "./webhook.service";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class SlotService {
	@WebSocketServer() private server: any

	constructor(
		@InjectRepository(Slot) private slotRepository: Repository<Slot>,
		@InjectRepository(SlotOverwrite) private slotOverwriteRepository: Repository<SlotOverwrite>,
		private tenantService: TenantService,
		private webhookService: WebhookService,
	) { }

	private getSlotOfWeek(midWeekStamp: number, slot: Slot, slotOverwrites: SlotOverwrite[]) {
		let slots = [];
		const twoWeeksAgo = Number(midWeekStamp) - (2 * 7 * 24 * 60 * 60);

		for (let index = 0; index <= 5; index++) {
			const startOfWeek = Number(twoWeeksAgo) + (index * 7 * 24 * 60 * 60);
			const yearWeek = moment.unix(Number(startOfWeek)).format('YYYY-w');
			const overwriteSlot = slotOverwrites.find((slotOw) => slotOw.overwriteDate === yearWeek && slotOw.slotUuid === slot.uuid);

			if (!overwriteSlot) {
				const isCrossWeek = moment.unix(Number(slot.start)).week() !== moment.unix(Number(slot.end)).week();

				slots = [...slots, {
					...slot,
					start: moment.unix(Number(slot.start))
						.set('week', moment.unix(Number(startOfWeek)).week())
						.unix() - (isCrossWeek ? 604800 : 0),
					end: moment.unix(Number(slot.end))
						.set('week', moment.unix(Number(startOfWeek)).week())
						.unix(),
				}];
			}
		}

		return slots;
	}

	public async find(beforeDate: string, afterDate: string): Promise<Paginated<Slot>> {
		const [slotsWithingTimeFrame, recurringSlots] = await Promise.all([
			this.slotRepository.createQueryBuilder('Slot')
				.leftJoinAndSelect('Slot.slotType', 'SlotType')
				.leftJoinAndSelect('Slot.user', 'User')
				.leftJoinAndSelect('User._userMeta', 'UserMeta')
				.andWhere('Slot.start < :beforeDate', { beforeDate: Number(beforeDate) + 7200 })
				.andWhere('Slot.start > :afterDate', { afterDate: Number(afterDate) - 7200 })
				.andWhere('Slot.recurring = false')
				.getMany(),
			this.slotRepository.createQueryBuilder('Slot')
				.leftJoinAndSelect('Slot.slotType', 'SlotType')
				.leftJoinAndSelect('Slot.user', 'User')
				.leftJoinAndSelect('User._userMeta', 'UserMeta')
				.andWhere('Slot.recurring = true')
				.getMany()
		]);

		const slotOverwrites = recurringSlots.length > 0 ? await this.slotOverwriteRepository.createQueryBuilder('SlotOverwrite')
			.where("SlotOverwrite.slotUuid IN (:...slots)", { slots: recurringSlots.map(x => x.uuid) })
			.getMany() : []

		const startOfWeek = moment.unix(Number(afterDate)).startOf('isoWeek').unix();
		const slotsUpdatedWithTime = recurringSlots.reduce((acc, slot) => {
			return [...acc, ...this.getSlotOfWeek(startOfWeek, slot, slotOverwrites)]
		}, []);

		return {
			_embedded: [...slotsWithingTimeFrame, ...slotsUpdatedWithTime]
				.filter((slot) => {
					return (slot.start < beforeDate || slot.end < beforeDate) && (slot.start > afterDate || slot.end > afterDate)
				})
				.sort((a, b) => a.start - b.start),
			_page: {
				totalEntities: 0
			},
		};
	}

	public async sync(): Promise<void> {
		const tenants = await this.tenantService.find(1, 3000);
		tenants._embedded.forEach((tenant) => this.handleWebhook(tenant))
	}

	private async handleWebhook(tenant: Tenant) {
		const startOfMinute = moment().startOf('minute').unix();
		const endOfMinute = moment().endOf('minute').unix();

		const { _embedded: slots } = await this.find(moment().add(2, 'days').unix().toString(), moment().subtract(2, 'days').unix().toString());
		const slot = slots.find((slot: Slot) => slot.start >= startOfMinute && slot.start < endOfMinute);

		if (!slot) {
			return;
		}

		this.webhookService.executeWebhook('slots/start', slot);
	}

	public findOne(search: any): Promise<Slot | undefined> {
		return this.slotRepository.findOne(search, {
			relations: ['slotType']
		});
	}

	private async checkSlotLength(slot: Partial<Slot>) {
		const slotLength = (slot.end - slot.start) / 60;
		const tenant = this.tenantService.findOne();
		const minLength = (await tenant).settings.minimumSlotDuration || 30
		const maxLength = (await tenant).settings.maximumSlotDuration || 1440
		let length: number;
		let msg: string;
		if (slotLength < minLength) {
			length = 1;
			msg = "This slot is too short";
		} else if (slotLength > maxLength) {
			length = 2;
			msg = "This slot is too long";
		} else {
			length = 0;
		}
		return {
			minLength,
			maxLength,
			slotLength,
			error: length > 0 ? true : false,
			msg
		};
	}

	private async checkNormalSlotForConflicts(slot: Partial<Slot>) {
		// Check a normal slot against
		const foundSlotsQuery = this.slotRepository.createQueryBuilder('Slot')
			.andWhere(new Brackets(qb => qb
				.where('Slot.start > :start AND Slot.end <= :start', { start: slot.start })
				.orWhere('Slot.start < :end AND Slot.end >= :end', { end: slot.end })
				.orWhere('Slot.start > :start AND Slot.end <= :end', { start: slot.start, end: slot.end })))
			.andWhere('Slot.recurring = false')

		if (slot.uuid) {
			foundSlotsQuery.andWhere('Slot.uuid != :slotUuid', { slotUuid: slot.uuid });
		}

		const foundSlots = await foundSlotsQuery.getMany();

		// Check a normal slot against a recurring
		const recurringSlotsFound = await this.checkSlotAgainstRecurringSlots(slot);

		const lengthCalc = await this.checkSlotLength(slot);

		return [lengthCalc, [...foundSlots, ...recurringSlotsFound]]
	}

	private async checkSlotAgainstRecurringSlots(slot: Partial<Slot>): Promise<Slot[]> {
		const allRecurringSlots = await this.slotRepository.createQueryBuilder('Slot')
			.andWhere('Slot.recurring = true')
			.getMany();

		return allRecurringSlots.filter((recurringSlot) => {
			const recurringSlotStart = moment.unix(recurringSlot.start)
				.set('week', moment.unix(slot.start).week())
				.set('year', moment.unix(slot.start).year())
				.unix();

			return (recurringSlotStart > slot.start && recurringSlotStart < slot.end)
		});
	}

	private async checkRecurringSlotForConflicts(slot: Partial<Slot>) {
		// Check a recurring slot against a recurring one
		const recurringSlotsFound = await this.checkSlotAgainstRecurringSlots(slot);

		const foundSlots = [];
		// Check recurring slot against a normal slot :monkaGiga:
		for (let index = 0; index <= 10; index++) {
			// TODO: find a way to not await every loop
			const start = moment.unix(slot.start).add(index, "weeks").unix()
			const end = moment.unix(slot.end).add(index, "weeks").unix()

			const slots = await this.slotRepository.createQueryBuilder('Slot')
				.andWhere(new Brackets(qb => qb
					.where('Slot.start > :start AND Slot.end <= :start', { start })
					.orWhere('Slot.start < :end AND Slot.end >= :end', { end })
					.orWhere('Slot.start > :start AND Slot.end <= :end', { start, end })))
				.andWhere('Slot.recurring = false')
				.getMany();
			foundSlots.push(...slots)
		}
		const lengthCalc = await this.checkSlotLength(slot);

		return [lengthCalc, [...recurringSlotsFound, ...foundSlots]];
	}

	public async verifyIntegrity(slot: Partial<Slot>): Promise<any> {

		if (slot.recurring === false) {
			return this.checkNormalSlotForConflicts(slot)
		}

		return this.checkRecurringSlotForConflicts(slot)
	}

	public async create(slot: Slot): Promise<Slot> {
		const createdSlot = await this.slotRepository.save({
			uuid: uuid.v4(),
			...slot,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		this.server.emit('timetable-updated');

		return this.slotRepository.findOne(createdSlot.uuid, {
			relations: ['slotType', 'user']
		});
	}

	public async createOverwrite(slot: Slot, overwriteDate: string): Promise<void> {
		await this.slotOverwriteRepository.save({
			uuid: uuid.v4(),
			slotUuid: slot.uuid,
			action: "delete",
			overwriteDate,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		this.server.emit('timetable-updated');

		return;
	}

	public async update(id: string, slot: Partial<Slot>): Promise<Slot> {
		slot.uuid = id;
		await this.slotRepository.save(slot);
		const updatedSlot = await  this.slotRepository.findOne(id, {
			relations: ['slotType', 'user']
		});

		this.server.emit('timetable-updated');
		return updatedSlot;
	}

	public async delete(slotUuid: string): Promise<void> {
		await this.slotRepository.delete(slotUuid);
		return;
	}
}
