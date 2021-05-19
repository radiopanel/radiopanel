import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Slot, SlotType, SlotOverwrite } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { SlotController } from './controllers/slot.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Slot, SlotType, SlotOverwrite]),
		SharedModule
	],
	controllers: [SlotController],
})
export class SlotModule {}
