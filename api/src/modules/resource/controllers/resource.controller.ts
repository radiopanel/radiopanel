import { Response } from 'express';
import sharp from 'sharp';
import slugify from 'slugify';
import { Query, Res, Get, Controller, UseGuards, BadRequestException } from '@nestjs/common';


import { TenantService } from '~shared/services/tenant.service';
import { StorageLoader } from '~shared/helpers/StorageLoader';
import { AuthGuard } from '~shared/guards/auth.guard';

import { ImageCacheService } from '../services/image-cache.service';

@Controller('resources')
@UseGuards(AuthGuard)
export class ResourceController {
	constructor(
		private imageCacheService: ImageCacheService,
		private tenantService: TenantService,
		private storageLoader: StorageLoader
	) {}

	@Get()
	public async find(@Query() params: any, @Res() response: Response): Promise<any> {
		response.setHeader('Cache-Control', 'max-age: 2419200');
		response.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
		const cachePath = `${slugify(params.path)}-h_${params.h}-w_${params.w}-q_${params.q}-f_${params.f}`;

		const cachedImage = await this.imageCacheService.findOne(params.tenant, cachePath);

		if (!params.f || params.f === 'png') {
			response.setHeader('Content-Type', 'image/png');
		} else if (params.f === 'jpg' || params.f === 'jpeg') {
			response.setHeader('Content-Type', 'image/jpeg');
		}

		if (cachedImage) {
			response.setHeader('X-Cache', 'HIT');
			response.end(cachedImage.data, 'utf-8');
			return response;
		}

		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();

		const stream = await client.get(params.path.replace(/^\//, ''));

		try {
			const resizer = sharp()
				.resize({
					...(params.w && { width: parseInt(params.w, 10) }),
					...(params.h && { height: parseInt(params.h, 10) }),
					fit: params.fit || 'cover',
				});

			if (!params.f || params.f === 'png') {
				resizer.png();
			} else if (params.f === 'jpg' || params.f === 'jpeg') {
				resizer.jpeg({
					...(params.q && { quality: parseInt(params.q, 10) }),
				});
			}

			response.setHeader('X-Cache', 'MISS');

			const resizeStream = stream.pipe(resizer);
			const chunks = [];

			resizeStream.on('data', (chunk) => {
				response.write(chunk);
				chunks.push(chunk);
			});

			resizeStream.on('end', () => {
				response.end();
				const imageData = Buffer.concat(chunks);
				this.imageCacheService.create(params.tenant, imageData, cachePath);
			});
		} catch {
			throw new BadRequestException()
		}
	}
}
