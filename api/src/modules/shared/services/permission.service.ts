import { Injectable, ForbiddenException } from "@nestjs/common";
import { propOr } from "ramda";
import * as jwt from 'jsonwebtoken'
import { ConfigService } from "@nestjs/config";
import { RedisService } from "nestjs-redis";

import { ApiKey } from "~entities";

import { ApiKeyService } from "./api-key.service";
import { UserService } from "./user.service";
import { TenantService } from "./tenant.service";

@Injectable()
export class PermissionService {
	constructor(
		private apiKeyService: ApiKeyService,
		private configService: ConfigService,
		private userService: UserService,
		private tenantService: TenantService,
		private readonly redisService: RedisService,
	) { }

	public async getPermissions(userUuid: string): Promise<string[]> {
		const [roles, userPermissions] = await Promise.all([
			this.userService.getRoles(userUuid),
			this.userService.getPermissions(userUuid)
		])
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
		const availablePermissions = userPermissions.reduce((acc, permission) => {
			if (permission.permissionType === "grant") {
				return [...acc, permission.permission];
			}

			return acc;
		}, permissionsWithDenies);

		return availablePermissions;
	}

	public async getApiKeyData(key: string): Promise<ApiKey> {
		const redisClient = this.redisService.getClient();

		const rawApiKey = await redisClient.get(`API_KEY:${key}`)

		if (!rawApiKey) {
			const apiKey = await this.apiKeyService.findOne({ key });

			redisClient.multi()
				.set(`API_KEY:${key}`, JSON.stringify(apiKey))
				.expire(`API_KEY:${key}`, 60 * 60)
				.exec();

			return apiKey;
		}

		return JSON.parse(rawApiKey)
	}

	private async handleBasicAuth(authToken: string, permissions: string[]): Promise<boolean> {
		const redisClient = this.redisService.getClient();

		const buff = Buffer.from(authToken.replace('Basic ', ''), 'base64');
		const key = buff.toString('ascii').split(':')[0];

		const apiKey = await this.getApiKeyData(key);

		if (!apiKey) {
			throw new ForbiddenException(`Passed api key could not be found`)
		}

		redisClient.multi()
			.incr(`API_KEY_USAGE:${apiKey.uuid}:${new Date().getMinutes()}`)
			.expire(`API_KEY_USAGE:${apiKey.uuid}:${new Date().getMinutes()}`, 59)
			.exec();

		const availablePermissions = (propOr([], 'permissions')(apiKey) as any[]).map((permission) => permission.permission);
		return !!permissions.every(permission => availablePermissions.indexOf(permission) > -1);
	}

	public async userHasPermission(userUuid: string, permissions: string[]): Promise<boolean> {
		const availablePermissions = await this.getPermissions(userUuid);

		return !!permissions.every(permission => availablePermissions.indexOf(permission) > -1);
	}

	public async hasPermission(authorizationHeaderOrUserUuid: string, permissions: string[]): Promise<boolean> {
		if (!permissions || !permissions.length) {
			return true;
		}

		if (!authorizationHeaderOrUserUuid) {
			return false;
		}

		if (authorizationHeaderOrUserUuid.startsWith('Basic ')) {
			return this.handleBasicAuth(authorizationHeaderOrUserUuid, permissions)
		}

		return this.userHasPermission(authorizationHeaderOrUserUuid, permissions)
	}
}
