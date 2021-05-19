import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Webhook } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { WebhookController } from './controllers/webhook.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Webhook]),
		SharedModule
	],
	controllers: [WebhookController],
	providers: [],
})
export class WebhookModule {}
