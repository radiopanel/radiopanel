import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Content, ContentType, ContentTypeField } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { ContentController } from './controllers/content.controller';
import { ContentTypeController } from './controllers/content-type.controller';
import { ContentTypeFieldController } from './controllers/content-type-field.controller';
import { ContentService } from './services/content.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Content, ContentType, ContentTypeField]),
		SharedModule
	],
	controllers: [ContentController, ContentTypeController, ContentTypeFieldController],
	providers: [ContentService]
})
export class ContentModule {}
