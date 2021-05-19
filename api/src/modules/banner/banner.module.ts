import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Banner } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { BannerService } from './services/banner.service';
import { BannerController } from './controllers/banner.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Banner]),
		SharedModule
	],
	controllers: [BannerController],
	providers: [BannerService],
})
export class BannerModule {}
