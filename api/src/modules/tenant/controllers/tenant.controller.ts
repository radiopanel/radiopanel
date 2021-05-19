import { Controller, Get, Body, Put, UseGuards, Param, Patch, Post, HttpCode, Delete, Headers, ForbiddenException, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { omit, reject, equals, pick } from 'ramda';
import got from 'got';
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';

import { Tenant } from '~entities/tenant.entity';
import { TenantService } from '~shared/services/tenant.service';
import { AuthGuard } from '~shared/guards/auth.guard';
import { Permissions, AuditLog } from '~shared/decorators';
import { RoleService } from '~shared/services/role.service';
import { permissions } from '~shared/permissions';
import { User } from '~shared/decorators/user.decorator';
import { UserService } from '~shared/services/user.service';
import { PermissionService } from '~shared/services/permission.service';
import slugify from 'slugify';

@Controller('tenants')
@ApiTags('Tenants')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class TenantController {
	constructor(
		private tenantService: TenantService,
		private roleService: RoleService,
		private configService: ConfigService,
		private userService: UserService,
		private permissionService: PermissionService,
	) { }

	@Post()
	@ApiOkResponse({ type: Tenant })
	public async create(@Body() tenant: any, @User() user): Promise<any> { 
		if (await this.tenantService.findOne()) {
			throw new ForbiddenException('The installation process has already concluded')
		}

		tenant.uuid = uuid.v4();
		tenant.slug = slugify(tenant.name);
		tenant.createdAt = new Date();
		tenant.updatedAt = new Date();
		await this.tenantService.create(tenant);

		const permissionsList = permissions.reduce((acc, permissionGroup) => {
			return {
				...acc,
				...permissionGroup.groups.reduce((groupAcc, group) => {
					if (group.requiresFeature) {
						return groupAcc;
					}

					return {
						...groupAcc,
						...group.permissions.reduce((permissionAcc, permission) => ({ ...permissionAcc, [permission.value]: true }), {})
					}
				}, {})
			}
		}, {}) as any;

		const createdRole = await this.roleService.create({
			name: 'Admin',
			uuid: uuid.v4(),
			createdAt: new Date(),
			updatedAt: new Date(),
			permissions: permissionsList,
		})

		const existingUser = await this.userService.findOne({ uuid: user.uuid });
		await this.userService.assignRole(existingUser.uuid, createdRole.uuid);

		return this.tenantService.findOne();
	}

	@Get('/customisation')
	public async findCustomisation(@Query('host') hostName: string): Promise<any> {
		const tenant = await this.tenantService.findOne();

		if (!tenant) {
			return null;
		}

		return tenant?.settings ? pick(['logo', 'primaryColor', 'authBackground'])(tenant?.settings) : undefined;
	}

	@Get('/:tenantUuid')
	@Permissions('settings/read')
	@ApiOkResponse({ type: Tenant })
	public async one(@Param('tenantUuid') id: string): Promise<Tenant | undefined> {
		return this.tenantService.findOne();
	}

	@Put('/:tenantUuid')
	@Permissions('settings/update')
	@AuditLog('settings/update')
	@ApiOkResponse({ type: Tenant })
	public async update(@Body() updatedTenant: any): Promise<Tenant> {
		const existingTenant = await this.tenantService.findOne();

		return this.tenantService.update(existingTenant.uuid, omit(['users', 'features'])({
			...existingTenant,
			...updatedTenant,
			updatedAt: new Date(),
		}) as any);
	}

	@Patch('/:tenantUuid')
	@Permissions('settings/update')
	@AuditLog('settings/update')
	@ApiOkResponse({ type: Tenant })
	public async patch(@Body() updatedTenant: any): Promise<Tenant> {
		const existingTenant = await this.tenantService.findOne();

		return this.tenantService.update(existingTenant.uuid, omit(['users', 'features'])({
			...existingTenant,
			...updatedTenant,
			settings: {
				...existingTenant.settings,
				...reject(equals('hidden'))({
					...updatedTenant.settings,
					something: "hidden"
				})
			},
			updatedAt: new Date(),
		}) as any);
	}
}
