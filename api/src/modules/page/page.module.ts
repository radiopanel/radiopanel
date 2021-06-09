import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Page, PageType, PageTypeField } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { PageController } from './controllers/page.controller';
import { PageTypeController } from './controllers/page-type.controller';
import { PageService } from './services/page.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Page, PageType, PageTypeField]),
		SharedModule
	],
	controllers: [PageController, PageTypeController],
	providers: [PageService]
})
export class PageModule {}
