import { Response } from 'express';
import sharp from 'sharp';
import slugify from 'slugify';
import { Query, Res, Get, Controller, UseGuards, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { TenantService } from '~shared/services/tenant.service';
import { StorageLoader } from '~shared/helpers/StorageLoader';
import { AuthGuard } from '~shared/guards/auth.guard';

import { ImageCacheService } from '../services/image-cache.service';

@Controller('resources')
@ApiTags('Storage')
@UseGuards(AuthGuard)
export class ResourceController {
	constructor(
		private imageCacheService: ImageCacheService,
		private tenantService: TenantService,
		private storageLoader: StorageLoader
	) {}

	@Get()
	@ApiOperation({ summary: 'Get image', description: 'Get a manipulated image based on path' })
	@ApiQuery({ name: 'f', description: 'File format', type: 'string', enum: ['png', 'jpg', 'jpeg'] })
	@ApiQuery({ name: 'w', description: 'Width in px', type: 'string' })
	@ApiQuery({ name: 'h', description: 'Height in px', type: 'string' })
	@ApiQuery({ name: 'path', description: 'Path to image', type: 'string' })
	@ApiQuery({ name: 'fit', description: 'How the image should constrain', type: 'string', enum: ['cover', 'contain', 'fill', 'inside', 'outside'] })
	public async find(@Query() params: any, @Res() response: Response): Promise<any> {
		response.setHeader('Cache-Control', 'max-age: 2419200');
		response.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
		const cachePath = `${slugify(params.path.replace(/^(\/uploads\.)/, ''))}-h_${params.h}-w_${params.w}-q_${params.q}-f_${params.f}`;

		const cachedImage = await this.imageCacheService.findOne(cachePath);

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

		const stream = await client.get(params.path.replace(/^(\/uploads)/, '').replace(/^\//, ''));

		stream.on('error', () => {
			response.end();
		});

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

			resizeStream.on('error', () => {
				response.end();
			});

			resizeStream.on('data', (chunk) => {
				response.write(chunk);
				chunks.push(chunk);
			});

			resizeStream.on('end', () => {
				response.end();
				const imageData = Buffer.concat(chunks);
				this.imageCacheService.create(imageData, cachePath);
			});
		} catch {
			throw new BadRequestException()
		}
	}
}
