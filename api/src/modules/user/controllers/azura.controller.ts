import { Controller, Get, Headers, UseGuards, Query, Post, Body, Delete, Param } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { Permissions } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';
import { UserService } from '~shared/services/user.service';

import { AzuraService } from '../services/azura.service';

@Controller('azuracast-users')
@ApiTags('Azura Users')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class AzuraController {

	constructor(
		private azuraService: AzuraService,
		private userService: UserService,
	) { }

	@Get()
	@Permissions('users/update')
	public async findUsers(@Query('page') page, @Query('pagesize') pagesize): Promise<any> {
		return await this.azuraService.findUsers(page, pagesize)
	}

	@Post()
	@Permissions('users/update')
	public async createUser(@Query('userUuid') userUuid: string): Promise<any> {
		const user = await this.userService.findOne({ uuid: userUuid });
		const azuraAccount = await this.azuraService.createUser(user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName);

		await this.userService.assignMeta('azuraAccount', userUuid, azuraAccount);
		return azuraAccount;
	}

	@Delete('/:azureUserId')
	@Permissions('users/update')
	public async deleteUser(@Param('azureUserId') azureUserId: string, @Query('userUuid') userUuid: string): Promise<any> {
		await this.azuraService.deleteUser(azureUserId);

		await this.userService.deleteMeta('azuraAccount', userUuid);
		return;
	}
}
