import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '~shared/shared.module';
import { Dashboard } from '~entities';

import { DashboardController } from './controllers/dashboard.controller';
import { DashboardService } from './services/dashboard.service';

@Module({
	imports: [
		SharedModule,
		TypeOrmModule.forFeature([Dashboard])
	],
	controllers: [DashboardController],
	providers: [DashboardService]
})
export class DashboardModule {}
