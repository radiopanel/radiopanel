import { Controller, Get, Param, Body, Put, Headers, UseGuards, Delete, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

import { User } from '~entities';
import { Paginated } from '~shared/types';
import { UserService } from '~shared/services/user.service';
import { AuditLog, Permissions } from '~shared/decorators';
import { TenantService } from '~shared/services/tenant.service';
import { AuthGuard } from '~shared/guards/auth.guard';
import { pick } from 'ramda';

@Controller('users')
@ApiTags('Users')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class UserController {

	constructor(
		private userService: UserService,
		private tenantService: TenantService,
	) { }

	@Get()
	@Permissions('users/read')
	public async findUsers(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<User> | undefined> {
		return await this.userService.find(page, pagesize)
	}

	@Get('/:userUuid')
	@Permissions('users/read')
	public async findOneUser(@Param('userUuid') userUuid: string): Promise<any> {
		const user = await this.userService.findOne({ uuid: userUuid });

		return {
			...user,
			roles: await this.userService.getRoles(userUuid),
			meta: await this.userService.getMeta(userUuid),
			permissions: await this.userService.getPermissions(userUuid)
		};
	}

	@Put('/:userUuid')
	@Permissions('users/update')
	@AuditLog('users/update')
	public async updateUser(@Param('userUuid') userUuid: string, @Body() user: any): Promise<User> {
		await Promise.all([
			this.userService.update(userUuid, pick(['username', 'email', 'avatar', 'bio', 'socials'])(user)),
			this.userService.assignRoles(userUuid, user.roles),
			this.userService.assignMeta('customData', userUuid, user.customData || {}),
			this.userService.updatePermissions(userUuid, user.permissions),
		])

		return this.userService.findOne({ uuid: userUuid });
	}

	@Delete('/:userUuid')
	@Permissions('users/delete')
	@AuditLog('users/delete')
	public async delete(@Param('userUuid') userUuid: string): Promise<void> {
		return this.userService.delete(userUuid);
	}

	@Put('/:userUuid/meta/:metaKey')
	@Permissions('users/update')
	public async updateMeta(@Param('userUuid') userUuid: string, @Param('metaKey') metaKey: string, @Body() meta: any): Promise<void> {
		return await this.userService.assignMeta(metaKey, userUuid, meta);
	}
}
