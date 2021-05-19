import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Ban } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { BanController } from './controllers/ban.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Ban]),
		SharedModule
	],
	controllers: [BanController],
	providers: [],
})
export class BanModule {}
