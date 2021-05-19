import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '~shared/shared.module';

import { StorageController } from './controllers/storage.controller';

@Module({
	imports: [
		SharedModule,
	],
	controllers: [StorageController],
})
export class StorageModule {}

