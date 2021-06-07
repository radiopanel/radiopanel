import { Controller, Get, UseGuards, Body, Put, Headers, Request } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { omit } from 'ramda';

import { AuthGuard } from '~shared/guards/auth.guard';
import { User } from '~shared/decorators/user.decorator';
import { UserService } from '~shared/services/user.service';

@Controller('profile')
@ApiTags('Profile')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class ProfileController {

	constructor(
		private userService: UserService,
	) { }

	@Get()
	public async findSelf(@Request() req): Promise<any> {
		return this.userService.findOne({ uuid: req.user?.uuid });
	}

	@Put()
	public async updateSelf(@Body() updatedUser: any, @Request() req ): Promise<any> {
		const currentUser = await this.userService.findOne({ uuid: req.user?.uuid });
		await this.userService.assignMeta('customData', req.user?.uuid, updatedUser.customData || {})
		return this.userService.update(req.user?.uuid, {
			...currentUser,
			...omit(['tenants', 'admin'])(updatedUser),
		});
	}
}
