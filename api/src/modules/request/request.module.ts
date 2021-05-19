import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Request } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { RequestService } from './services/request.service';
import { RequestController } from './controllers/request.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Request]),
		SharedModule
	],
	controllers: [RequestController],
	providers: [RequestService],
})
export class RequestModule {}
