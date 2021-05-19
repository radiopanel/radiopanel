import { Module } from '@nestjs/common';

import { SharedModule } from '~shared/shared.module';

import { StatusController } from './controllers/status.controller';
import { AuthGateway } from './services/auth.gateway';

@Module({
	imports: [
		SharedModule
	],
	providers: [AuthGateway],
	controllers: [StatusController],
})
export class CoreModule {}
