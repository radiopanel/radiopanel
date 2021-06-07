import { Controller, Get, Body, Post, Put, HttpCode, UnauthorizedException, Param, Req, ForbiddenException, Request, Response } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import * as bcryptjs from 'bcryptjs'
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';

import { PasswordReset } from '~entities';
import { UserService } from '~shared/services/user.service';

import { PasswordResetService } from '../services/password-reset.service';
import { TenantService } from '~shared/services/tenant.service';

@Controller('auth')
@ApiTags('Authentication')
@ApiBasicAuth()
export class AuthController {
	constructor(
		private userService: UserService,
		private passwordResetService: PasswordResetService,
		private tenantService: TenantService,
		private configService: ConfigService,
	) { }

	@Post('/login/local')
	public async localLogin(@Request() req): Promise<any> {
		return req.user;
	}

	@Post('/login/:authMethodUuid')
	public async dynamicLogin(@Request() req, @Response() res): Promise<any> {
		res.cookie('loggedIn', true);
		return res.redirect('/');
	}

	@Get('/login/:authMethodUuid')
	public async dynamicLoginReturn(@Request() req, @Response() res): Promise<any> {
		res.cookie('loggedIn', true);
		return res.redirect('/');
	}

	@Post('/logout')
	public async logout(@Request() req): Promise<any> {
		req.logout();

		return { ok: true }
	}

	@Post('/register')
	public async register(@Body() body: any, @Request() req): Promise<any> {
		// check if there already is a tenant
		if (await this.tenantService.findOne()) {
			throw new ForbiddenException('The installation process has already concluded')
		}

		if (await this.userService.findOne({ email: body.email })) {
			throw new ForbiddenException('Please use a unique email')
		}

		const user = await this.userService.create({
			uuid: uuid.v4(),
			password: bcryptjs.hashSync(body.password),
			email: body.email,
			username: body.username,
			updatedAt: new Date(),
			createdAt: new Date(),
			avatar: this.configService.get('app.frontendBaseUrl') + '/assets/img/logo-alternative.png',
		});

		req.login(user, () => {});
		return { ok: true };
	}

	@Put('/password-reset/:passwordResetUuid')
	@HttpCode(204)
	public async resetPassword(@Param('passwordResetUuid') passwordResetUuid: string, @Body() body: any): Promise<void> {
		const passwordReset = await this.passwordResetService.findOne(passwordResetUuid);
		const user = await this.userService.findOne({ email: passwordReset.emailAddress });

		user.password = bcryptjs.hashSync(body.password);
		await this.userService.update(user.uuid, user);

		await this.passwordResetService.delete(passwordResetUuid);

		return;
	}

	@Get('/password-reset/:passwordResetUuid')
	public async getPasswordReset(@Param('passwordResetUuid') passwordResetUuid: string): Promise<PasswordReset> {
		return await this.passwordResetService.findOne(passwordResetUuid);
	}

	@Post('/password-reset')
	@HttpCode(204)
	public async createPasswordReset(@Body() body: any): Promise<void> {
		const user = await this.userService.findOne({ email: body.emailAddress });

		if (!user) {
			return;
		}

		const passwordReset = await this.passwordResetService.create(body);
		await this.passwordResetService.sendPasswordResetMail(passwordReset, user);

		return;
	}

	@Get('/user')
	public async user(@Req() req): Promise<any> {
		if (!req.user?.uuid) {
			throw new UnauthorizedException();
		}

		const user = await this.userService.findOne({ uuid: req.user?.uuid });
		const tenant = await this.tenantService.findOne()

		if (!user) {
			throw new UnauthorizedException();
		}

		const [roles, meta, userPermissions] = await Promise.all([
			this.userService.getRoles(user.uuid),
			this.userService.getMeta(user.uuid),
			this.userService.getPermissions(user.uuid),
		]);

		// Concat all roles and permissions
		const uniquePermissions = roles.reduce((acc, role) => ([...acc, ...role.permissions]), []);
		const permissionsWithDenies = uniquePermissions.reduce((acc, permission) => {
			// Check if we can find a deny in the user permissions
			const userPermission = userPermissions.find((perm) => perm.permission === permission.permission);

			if (!userPermission || userPermission?.permissionType !== "deny") {
				return [...acc, permission.permission];
			}

			return acc;
		}, []);

		// Apply the grant permissions
		const appliedPermissions = userPermissions.reduce((acc, permission) => {
			if (permission.permissionType === "grant") {
				return [...acc, permission.permission];
			}

			return acc;
		}, permissionsWithDenies);

		return {
			user: {
				...user,
				meta: meta.reduce((acc, meta) => ({
					...acc,
					[meta.key]: meta
				}), {}),
			},
			roles,
			tenant,
			permissions: appliedPermissions,
		};
	}

}
