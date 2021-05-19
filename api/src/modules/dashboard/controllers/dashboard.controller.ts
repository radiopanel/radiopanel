import { Controller, Headers, Get, UseGuards, UnauthorizedException, Put, Body } from '@nestjs/common';
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
	public async find(@User() user: any): Promise<any> {
		if (!user) {
			throw new UnauthorizedException();
		}

		return this.dashboardService.findOne(user.uuid)
	}

	@Put()
	public async update(@User() user: any, @Body() data: any): Promise<any> {
		if (!user) {
			throw new UnauthorizedException();
		}

		return this.dashboardService.update(user.uuid, data)
	}
}
