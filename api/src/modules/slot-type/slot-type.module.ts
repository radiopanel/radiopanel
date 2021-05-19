import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SlotType } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { SlotTypeService } from './services/slot-type.service';
import { SlotTypeController } from './controllers/slot-type.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([SlotType]),
		SharedModule
	],
	controllers: [SlotTypeController],
	providers: [SlotTypeService],
})
export class SlotTypeModule {}
