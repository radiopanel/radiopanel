import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageCache } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { ImageCacheService } from './services/image-cache.service';
import { StorageController } from './controllers/storage.controller';
import { ResourceController } from './controllers/resource.controller';


@Module({
	imports: [
		TypeOrmModule.forFeature([ImageCache]),
		SharedModule,
	],
	controllers: [StorageController, ResourceController],
	providers: [ImageCacheService]
})
export class ResourceModule {}
