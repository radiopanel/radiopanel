import { Controller, Request, Get, UseGuards, UnauthorizedException, Put, Body } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '~shared/guards/auth.guard';
import { User } from '~shared/decorators';

import { DashboardService } from '../services/dashboard.service';

@Controller('/dashboard')
@ApiTags('Dashboard')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class DashboardController {
	constructor(
		private dashboardService: DashboardService,
	) {}

	@Get()
	public async find(@Request() req): Promise<any> {
		if (!req.user?.uuid) {
			throw new UnauthorizedException();
		}

		return this.dashboardService.findOne(req.user.uuid)
	}

	@Put()
	public async update(@Request() req, @Body() data: any): Promise<any> {
		if (!req.user?.uuid) {
			throw new UnauthorizedException();
		}

		return this.dashboardService.update(req.user.uuid, data)
	}
}
