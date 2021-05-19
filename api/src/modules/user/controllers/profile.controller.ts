import { Controller, Get, UseGuards, Body, Put, Headers } from '@nestjs/common';
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
	public async findSelf(@User() user): Promise<any> {
		return this.userService.findOne({ uuid: user.uuid });
	}

	@Put()
	public async updateSelf(@Body() updatedUser: any, @User() user ): Promise<any> {
		await this.userService.assignMeta('customData', user.uuid, updatedUser.customData || {})
		return this.userService.update(user.uuid, {
			...user,
			...omit(['tenants', 'admin'])(updatedUser),
		});
	}

	@Put('/accept-rules')
	public async acceptRules(@User() user): Promise<any> {
		return this.userService.update(user.uuid, {
			...user,
			rulesAcceptedAt: new Date()
		});
	}
}
