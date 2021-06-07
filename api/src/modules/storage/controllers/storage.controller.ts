import { extname, join } from 'path';

import { Controller, Post, UseGuards, Request, BadRequestException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import * as uuid from 'uuid';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';

import { User } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('storage')
@ApiTags('Storage')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class StorageController {

	constructor(
		private configService: ConfigService,
	) { }

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	public async upload (@Request() req, @UploadedFile() file: Express.Multer.File): Promise<any> {
		if (!req.user?.uuid || !req.headers['x-filename']) {
			throw new BadRequestException()
		}

		const fileName = `${uuid.v4()}${extname(req.headers['x-filename'] as string)}`;
		fs.writeFileSync(join(__dirname, '../../../../../', 'uploads', fileName), file.buffer);

		return { url: `/uploads/${fileName}` };
	};
}
