import { Controller, Get, Param, Headers, UseGuards, Post, Body, Put, Delete, Query, Res, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import got from 'got/dist/source';

import { Banner as BannerEntity } from '~entities';
import { Paginated } from '~shared/types';
import { Permissions, AuditLog } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';

import { BannerService } from '../services/banner.service';

@Controller('banners')
@ApiTags('Banners')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class BannerController {

	constructor(
		private bannerService: BannerService,
	) { }

	@Get()
	@Permissions('banners/read')
	public async find(@Query('page') page, @Query('pagesize') pagesize, @Query('random') random = "false", @Query('tag') tag = null): Promise<Paginated<BannerEntity> | undefined> {
		return this.bannerService.find(page, pagesize, random === "true", tag);
	}

	@Get('/:bannerUuid')
	@Permissions('banners/read')
	public async findOne(@Param('bannerUuid') bannerUuid: string): Promise<any> {
		return this.bannerService.findOne({ uuid: bannerUuid });
	}

	@Get('/:bannerSlug/image')
	public async getImage(@Param('bannerSlug') bannerSlug: string, @Res() res): Promise<any> {
		const banner = await this.bannerService.findOne({ slug: bannerSlug });

		if (!banner) {
			throw new NotFoundException()
		}

		return res.redirect(302, banner.image);
	}

	@Post()
	@Permissions('banners/create')
	@AuditLog('banners/create')
	public async create(@Body() banner: BannerEntity): Promise<any> {
		return this.bannerService.create(banner);
	}

	@Put('/:bannerUuid')
	@Permissions('banners/update')
	@AuditLog('banners/update')
	public async update(@Param('bannerUuid') uuid: string, @Body() banner: BannerEntity): Promise<any> {
		return this.bannerService.update(uuid, banner);
	}

	@Delete('/:bannerUuid')
	@Permissions('banners/update')
	@AuditLog('banners/delete')
	public async delete(@Param('bannerUuid') uuid: string): Promise<any> {
		return this.bannerService.delete(uuid);
	}
}
