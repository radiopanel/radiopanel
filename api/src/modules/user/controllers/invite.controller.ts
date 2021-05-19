import { Controller, Get, Body, Post, Put, HttpCode, Param, Headers, Delete, Res, BadRequestException, UseGuards, Query, UnauthorizedException } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken'
import * as bcryptjs from 'bcryptjs'
import * as uuid from 'uuid';
import { classToPlain } from 'class-transformer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { omit } from 'ramda';

import { User, Invite } from '~entities';
import { Paginated } from '~shared/types';
import { TenantService } from '~shared/services/tenant.service';
import { UserService } from '~shared/services/user.service';
import { Permissions, AuditLog, User as UserDecorator } from '~shared/decorators';
import { AuthGuard } from '~shared/guards/auth.guard';

import { InviteService } from '../services/invite.service';

@Controller('invites')
@ApiTags('Invites')
@ApiBasicAuth()
@UseGuards(AuthGuard)
export class InviteController {

	constructor(
		private userService: UserService,
		private inviteService: InviteService,
		private tenantService: TenantService,
		private configService: ConfigService,
	) { }

	@Post('/:inviteUuid/resend')
	@HttpCode(204)
	@Permissions('invites/create')
	@AuditLog('invites/resend')
	public async resendInvite(@Param('inviteUuid') inviteUuid: string): Promise<void> {
		const invite = await this.inviteService.findOne(inviteUuid);
		const tenant = await this.tenantService.findOne();

		await this.inviteService.sendRegistrationInviteMail(tenant, invite);

		return;
	}

	@Post('/:inviteUuid/register')
	@HttpCode(204)
	public async register(@Param('inviteUuid') inviteUuid: string, @Body() user: User): Promise<void> {
		const invite = await this.inviteService.findOne(inviteUuid);

		const createdUser = await this.userService.create({
			uuid: uuid.v4(),
			...user,
			password: bcryptjs.hashSync(user.password),
			email: invite.emailAddress,
			username: invite.username,
			socials: {},
			updatedAt: new Date(),
			createdAt: new Date(),
			admin: false,
		} as any);

		await this.userService.assignRole(createdUser.uuid, invite.role.uuid);
		await this.inviteService.delete(inviteUuid);

		return;
	}

	@Get('/:inviteUuid')
	public async findOne(@Param('inviteUuid') inviteUuid: string): Promise<Invite> {
		return this.inviteService.findOne(inviteUuid);
	}

	@Get()
	@Permissions('invites/read')
	public find(@Query('page') page, @Query('pagesize') pagesize): Promise<Paginated<Invite>> {
		return this.inviteService.find(page, pagesize);
	}

	@Delete('/:inviteUuid')
	@HttpCode(204)
	@Permissions('invites/delete')
	@AuditLog('invites/delete')
	public delete(@Param('inviteUuid') inviteUuid: string): Promise<void> {
		return this.inviteService.delete(inviteUuid);
	}

	@Post()
	@Permissions('invites/create')
	@AuditLog('invites/create')
	public async create(@Body() inviteData: Invite): Promise<Invite> {
		const tenant = await this.tenantService.findOne();

		// Check if an invite already exists, if yes, then just use that to send the mail
		const existingInvite = await this.inviteService.findOne({
			emailAddress: inviteData.emailAddress,
		});

		if (existingInvite) {
			throw new BadRequestException('User is already invited');
		}

		// Create an invite
		const invite = await this.inviteService.create(inviteData);

		await this.inviteService.sendRegistrationInviteMail(tenant, invite);

		return this.inviteService.findOne(invite.uuid);
	}
}
