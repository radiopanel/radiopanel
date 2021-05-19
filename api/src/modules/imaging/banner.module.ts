import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Imaging } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { ImagingService } from './services/imaging.service';
import { ImagingController } from './controllers/imaging.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Imaging]),
		SharedModule
	],
	controllers: [ImagingController],
	providers: [ImagingService],
})
export class ImagingModule {}
