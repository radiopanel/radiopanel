import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { ImageCache } from "~entities";

@Injectable()
export class ImageCacheService {

	constructor(
		@InjectRepository(ImageCache) private imageCacheRepository: Repository<ImageCache>
	) { }

	public findOne(slug: string): Promise<ImageCache | undefined> {
		return this.imageCacheRepository.findOne({
			slug,
		});
	}

	public async create(imageData: Buffer, slug: string): Promise<ImageCache> {
		const imageCache = new ImageCache();
		imageCache.uuid = uuid.v4();
		imageCache.createdAt = new Date();
		imageCache.updatedAt = new Date();
		imageCache.slug = slug;
		imageCache.data = imageData;

		return await this.imageCacheRepository.save(imageCache);
	}

	public async delete(): Promise<void> {
		await this.imageCacheRepository.delete({});
		return;
	}

}
