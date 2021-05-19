import { Module } from '@nestjs/common';

import { SharedModule } from '~shared/shared.module';

import { ResourceController } from './controllers/resource.controller';


@Module({
	imports: [
		SharedModule,
	],
	controllers: [ResourceController],
})
export class ResourceModule {}
