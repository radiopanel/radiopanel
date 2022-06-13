import { Controller, Post, Delete, HttpCode, Headers, Query, UploadedFile, Get, Res, UseGuards, Body, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import * as mimeTypes from 'mime-types';
import { FileInterceptor } from "@nestjs/platform-express";

import { TenantService } from "~shared/services/tenant.service";
import { StorageLoader } from "~shared/helpers/StorageLoader";
import { StorageItem } from "~shared/types";
import { Permissions } from "~shared/decorators";
import { AuthGuard } from "~shared/guards/auth.guard";

@Controller('storage')
@ApiTags('Storage')
@UseGuards(AuthGuard)
export class StorageController {
	constructor(
		private tenantService: TenantService,
		private storageLoader: StorageLoader
	) {}

	@Get()
	public async find(@Query() params: any, @Res() response: Response): Promise<any> {
		const fileName = params.path.split('/').pop()
		response.setHeader('Content-Type', mimeTypes.lookup(params.path) as string);
		response.setHeader('Cache-Control', 'max-age: 2419200');
		response.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
		response.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());

		response.setHeader('X-Cache', 'MISS');

		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();
		const stream = await client.get(params.path.replace(/^(\/uploads)/, '').replace(/^\//, ''));

		stream.resume();
		stream.on('readable', () => {
			stream.read();
		})
		stream.on('data', (chunk) => response.write(chunk));
		stream.on('end', () => response.end());
	}

	@Get('/directory')
	@Permissions('storage/list')
	public async list(@Query('dir') dir = ''): Promise<StorageItem[]> {
		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();

		return await client.list(dir.replace(/^(\/uploads)/, ''));
	}

	@Post()
	@HttpCode(204)
	@UseInterceptors(FileInterceptor('file'))
	@Permissions('storage/upload')
	public async upload(
		@Query('dir') dir = '',
		@UploadedFile() file: any
	): Promise<void> {
		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();

		return await client.put(`${dir}/${file.originalname}`.replace(/^(\/uploads)/, '').replace(/^\//, ''), file.buffer);
	}

	@Delete()
	@HttpCode(204)
	@Permissions('storage/delete')
	public async delete(
		@Query('dir') dir = ''
	): Promise<void> {
		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();

		return client.delete(dir.replace(/^(\/uploads)/, '').replace(/^\//, ''));
	}

	@Post('/directory')
	@HttpCode(204)
	@Permissions('storage/create-directory')
	public async createDirectory(@Query('dir') dir = ''): Promise<void> {
		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();

		await client.mkdir(dir.replace(/^(\/uploads)/, ''));
		return;
	}

	@Delete('/directory')
	@HttpCode(204)
	@Permissions('storage/delete-directory')
	public async deleteDirectory(@Query('dir') dir = ''): Promise<void> {
		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();

		await client.rmdir(dir.replace(/^(\/uploads)/, ''));
		return;
	}

	@Post('/move')
	@HttpCode(204)
	@Permissions('storage/edit')
	public async move(@Body() body): Promise<void> {
		const tenant = await this.tenantService.findOne();
		const StorageClient = this.storageLoader.load(tenant.settings.storageMedium || 'fs');
		const client = new StorageClient(tenant.settings.storageConfig);
		await client.init();

		await client.move(body.oldPath.replace(/^(\/uploads)/, ''), body.newPath.replace(/^(\/uploads)/, ''));
		return;
	}
}
