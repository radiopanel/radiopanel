import { Controller, Get, Param, Headers, UseGuards, Post, Body, Put, Delete, Query, UnauthorizedException, Res } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { Permissions, AuditLog } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';

import { ImagingService } from '../services/imaging.service';

@Controller('imaging')
@ApiTags('Imaging')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class ImagingController {

	constructor(
		private imagingService: ImagingService,
	) { }

	@Get()
	@Permissions('imaging/read')
	public async find(@Query('page') page, @Query('pagesize') pagesize): Promise<any> {
		return this.imagingService.find(page, pagesize);
	}

	@Get('/:imagingUuid')
	@Permissions('imaging/read')
	public async findOne(@Param('imagingUuid') uuid: string): Promise<any> {
		return this.imagingService.findOne({ uuid });
	}

	@Get('/:imagingUuid/download')
	public async download(@Param('imagingUuid') uuid: string, @Res() res: any): Promise<any> {
		const imaging = await this.imagingService.findOne({ uuid });
		const buffer = await this.imagingService.download({ uuid });

		res.setHeader('Content-Type', 'application/zip, application/octet-stream');
		res.setHeader('Content-Disposition', `attachment; filename=${imaging.name}.zip`);
		res.end(Buffer.from(buffer, 'base64'));
	}

	@Post()
	@Permissions('imaging/create')
	@AuditLog('imaging/create')
	public async create(@Body() imaging: any): Promise<any> {
		return this.imagingService.create(imaging);
	}

	@Put('/:imagingUuid')
	@Permissions('imaging/update')
	@AuditLog('imaging/update')
	public async update(@Param('imagingUuid') uuid: string, @Body() imaging: any): Promise<any> {
		if (!await this.imagingService.findOne({ uuid })) {
			throw new UnauthorizedException()
		}

		return this.imagingService.update(uuid, {
			...imaging
		});
	}

	@Delete('/:imagingUuid')
	@Permissions('imaging/update')
	@AuditLog('imaging/delete')
	public async delete(@Param('imagingUuid') uuid: string): Promise<any> {
		if (!await this.imagingService.findOne({ uuid })) {
			throw new UnauthorizedException()
		}

		return this.imagingService.delete(uuid);
	}
}
