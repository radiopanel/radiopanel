import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards, Query, UnauthorizedException, NotAcceptableException } from "@nestjs/common";
import * as uuid from 'uuid'
import { ApiBasicAuth, ApiTags } from "@nestjs/swagger";


import { Paginated } from "~shared/types";
import { Role } from "~entities";
import { Permissions, AuditLog } from "~shared/decorators";
import { AuthGuard } from "~shared/guards/auth.guard";
import { RoleService } from "~shared/services/role.service";

@Controller('roles')
@ApiTags('Roles')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class RoleController {

	constructor(
		private roleService: RoleService
	) { }

	@Get()
	@Permissions('roles/read')
	public find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<Role>> {
		return this.roleService.find(page, pagesize);
	}

	@Get('/:id')
	@Permissions('roles/read')
	public one(@Param('id') id: string): Promise<Role | undefined> {
		return this.roleService.findOne({ uuid: id });
	}

	@Post()
	@Permissions('roles/create')
	@AuditLog('roles/create')
	public create(@Body() role: Role, @Headers('x-tenant') tenant: string): Promise<Role> {
		role.uuid = uuid.v4();
		role.createdAt = new Date();
		role.updatedAt = new Date();
		return this.roleService.create(role);
	}

	@Put('/:id')
	@Permissions('roles/update')
	@AuditLog('roles/update')
	public async update(@Param('id') id: string, @Body() role: Role ): Promise<Role> {
		if (!await this.roleService.findOne({ uuid: id })) {
			throw new UnauthorizedException()
		}

		return this.roleService.update(id, {
			...role,
		});
	}

	@Delete('/:id')
	@Permissions('roles/delete')
	@AuditLog('roles/delete')
	public async delete(@Param('id') id: string): Promise<void> {
		const role = await this.roleService.findOne({ uuid: id }, true);

		if (!role) {
			throw new UnauthorizedException()
		}

		if (role.users.length !== 0) {
			throw new NotAcceptableException('Please make sure no users are assigned to this role')
		}

		return this.roleService.delete(id);
	}

}
