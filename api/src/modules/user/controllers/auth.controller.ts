import { Controller, Get, Body, Post, Put, HttpCode, NotFoundException, UnauthorizedException, Param, Req, Headers, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken'
import * as bcryptjs from 'bcryptjs'
import * as uuid from 'uuid';
import got from 'got';
import { classToPlain } from 'class-transformer';
import { pathOr, propOr, map, omit } from 'ramda';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { User, PasswordReset } from '~entities';
import { UserService } from '~shared/services/user.service';
import { AuthGuard } from '~shared/guards/auth.guard';

import { PasswordResetService } from '../services/password-reset.service';
import { TenantService } from '~shared/services/tenant.service';

@Controller('auth')
@ApiTags('Authentication')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class AuthController {
	constructor(
		private userService: UserService,
		private passwordResetService: PasswordResetService,
		private tenantService: TenantService,
		private configService: ConfigService,
	) { }

	@Post('/login')
	public async login(@Body() body: any): Promise<any> {
		const user = await this.userService.findOne({ email: body.email });

		if (!user) {
			throw new UnauthorizedException('Please make sure all your details are correct');
		}

		const isValidUser = await User.comparePassword(user, body.password);

		if (!isValidUser) {
			throw new UnauthorizedException('Please make sure all your details are correct');
		}

		return {
			token: jwt.sign(classToPlain({
				user: omit(['tenants'])(await this.userService.findOne({ uuid: user.uuid }))
			}), this.configService.get<string>('jwt.privateKey')),
		};
	}

	@Post('/register')
	public async register(@Body() body: any): Promise<any> {
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

		return {
			token: jwt.sign(classToPlain({
				user: omit(['tenants'])(user)
			}), this.configService.get<string>('jwt.privateKey')),
		};
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
	public async user(@Req() req: Request ): Promise<any> {
		const token = pathOr('', ['headers', 'authorization'])(req).replace('Bearer ', '');

		const user = await this.userService.findOne({ uuid: (jwt.decode(token) as any).user.uuid });
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
