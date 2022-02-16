import { Strategy as SamlStrategy, Profile as SamlProfile } from "passport-saml";
import OAuth2Strategy, { Strategy as OAuthStrategy } from "passport-oauth2";
import { Inject, Injectable, NestMiddleware, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserService } from "~shared/services/user.service";
import * as uuid from 'uuid';
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import * as crypto from 'crypto';
import { RoleService } from "~shared/services/role.service";
import * as bcryptjs from 'bcryptjs'
import { AuthMethodService } from "~shared/services/auth-method.service";
import { AuthenticationMethod } from "~entities/authentication-method.entity";
import got from "got/dist/source";

@Injectable()
export class DynamicStrategyProvider implements NestMiddleware {
	constructor(
		private userService: UserService,
		private roleService: RoleService,
		private configService: ConfigService,
		private authMethodService: AuthMethodService,
	) {}

	public async use(req: Request, res: Response, next: NextFunction) {
		const authMethod = await this.authMethodService.findOne(req.params['0']);

		if (!authMethod) {
			return next();
		}

		const strategy = await this.getConfiguration(authMethod);

		passport.authenticate(strategy)(req, res, next);
	}

	private async getConfiguration(authMethod: AuthenticationMethod): Promise<SamlStrategy | OAuth2Strategy> {
		if (authMethod.type === 'saml') {
			return this.createSamlStrategy(authMethod);
		}

		if (authMethod.type === 'oauth2') {
			return this.createOAuthStrategy(authMethod);
		}

		if (authMethod.type === 'discord') {
			return this.createDiscordStrategy(authMethod);
		}
	}

	private async createSamlStrategy(authMethod: AuthenticationMethod): Promise<SamlStrategy> {
		return new SamlStrategy(
			{
				callbackUrl: `${this.configService.get('app.frontendBaseUrl')}/api/v1/auth/login/${authMethod.uuid}`,
				entryPoint: authMethod.config.entryPoint,
				cert: authMethod.config.cert,
				issuer: authMethod.config.issuer
			},
			async (user: SamlProfile, done: Function): Promise<any> => {
				const existingUser = await this.userService.findOne({ email: user.nameID, authenticationMethodUuid: authMethod.uuid });

				if (existingUser) {
					return done(null, existingUser);
				}

				const createdUser = await this.userService.create({
					uuid: uuid.v4(),
					password: bcryptjs.hashSync(this.generatePassword(50)),
					email: user.nameID,
					authenticationMethodUuid: authMethod.uuid,
					username: user['http://schemas.microsoft.com/identity/claims/displayname'] as string || user.nameID,
					updatedAt: new Date(),
					createdAt: new Date(),
					avatar: this.configService.get('app.frontendBaseUrl') + '/assets/img/logo-alternative.png',
				});

				await this.userService.assignRole(createdUser.uuid, authMethod.defaultRoleUuid);

				done(null, createdUser)
			}
		);
	}

	private async createOAuthStrategy(authMethod: AuthenticationMethod): Promise<OAuthStrategy> {
		return new OAuthStrategy(
			{
				authorizationURL: authMethod.config.authorizationURL,
				tokenURL: authMethod.config.tokenURL,
				clientID: authMethod.config.clientID,
				clientSecret: authMethod.config.clientSecret,
				callbackURL: `${this.configService.get('app.frontendBaseUrl')}/api/v1/auth/login/${authMethod.uuid}`,
				scope: authMethod.config.scope || 'openid profile email'
			},
			async (accessToken: string, _, __, done: Function): Promise<any> => {
				await got.get(authMethod.config.userinfoURL, {
					headers: {
						'Authorization': `Bearer ${accessToken}`
					},
					resolveBodyOnly: true,
					responseType: 'json'
				})
					.json<{
						sub: string;
						nickname: string;
						name: string;
						picture: string;
						updated_at: string;
						email: string;
						email_verified: false;
					}>()
					.then(async (result) => {
						const existingUser = await this.userService.findOne({ email: result.email, authenticationMethodUuid: authMethod.uuid });

						if (existingUser) {
							return done(null, existingUser);
						}

						const createdUser = await this.userService.create({
							uuid: uuid.v4(),
							password: bcryptjs.hashSync(this.generatePassword(50)),
							email: result.email,
							authenticationMethodUuid: authMethod.uuid,
							username: result.nickname,
							updatedAt: new Date(),
							createdAt: new Date(),
							avatar: result.picture,
						});

						await this.userService.assignRole(createdUser.uuid, authMethod.defaultRoleUuid);

						return done(null, createdUser)
					})
			}
		);
	}
	private async createDiscordStrategy(authMethod: AuthenticationMethod): Promise<OAuthStrategy> {
		const strategy = new OAuthStrategy(
			{
				authorizationURL: 'https://discord.com/api/oauth2/authorize',
				tokenURL: 'https://discord.com/api/oauth2/token',
				clientID: authMethod.config.clientID,
				clientSecret: authMethod.config.clientSecret,
				callbackURL: `${this.configService.get('app.frontendBaseUrl')}/api/v1/auth/login/${authMethod.uuid}`,
				scope: 'identify email guilds',
			},
			async (accessToken: string, _, __, done: Function): Promise<any> => {
				console.log(accessToken)
				await got.get('https://discord.com/api/users/@me', {
					headers: {
						'authorization': `Bearer ${accessToken}`
					},
					resolveBodyOnly: true,
					responseType: 'json'
				})
					.json<{
						id: string;
						username: string;
						avatar: string;
						email: string;
					}>()
					.then(async (result) => {
						const existingUser = await this.userService.findOne({ email: result.email, authenticationMethodUuid: authMethod.uuid });

						if (existingUser) {
							return done(null, existingUser);
						}

						const createdUser = await this.userService.create({
							uuid: uuid.v4(),
							password: bcryptjs.hashSync(this.generatePassword(50)),
							email: result.email,
							authenticationMethodUuid: authMethod.uuid,
							username: result.username,
							updatedAt: new Date(),
							createdAt: new Date(),
							avatar: `https://cdn.discordapp.com/avatars/${result.id}/${result.avatar}.png`,
						});

						await this.userService.assignRole(createdUser.uuid, authMethod.defaultRoleUuid);

						return done(null, createdUser)
					})
					.catch((e) => console.error(e.response.body))
			}
		);

		return strategy;
	}

	private generatePassword = (
		length = 20,
		wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
	  ): string =>
		Array.from(crypto.randomFillSync(new Uint32Array(length)))
		  .map((x) => wishlist[x % wishlist.length])
		  .join('')
}
