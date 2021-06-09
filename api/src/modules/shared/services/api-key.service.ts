/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import moment from "moment";
import { LessThan, Repository } from "typeorm";
import { RedisService } from "nestjs-redis";

import { ApiKeyPermission, ApiKey, Tenant, ApiKeyUsage } from "~entities";
import { Paginated } from "~shared/types";

import { TenantService } from "./tenant.service";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ApiKeyService {

	constructor(
		@InjectRepository(ApiKey) private apiKeyRepository: Repository<ApiKey>,
		@InjectRepository(ApiKeyPermission) private apiKeyPermissionRepository: Repository<ApiKeyPermission>,
		@InjectRepository(ApiKeyUsage) private apiKeyUsageRepository: Repository<ApiKeyUsage>,
		private readonly redisService: RedisService,
		private readonly tenantService: TenantService,
	) { }

	@Cron('* * * * *')
	public async handleCron(): Promise<void> {
		this.apiKeyUsageRepository.delete({
			createdAt: LessThan(moment().subtract(1, 'hour').toDate()),
		})

		const tenant = await this.tenantService.findOne();

		if (!tenant) {
			return;
		}

		this.getKeyUsage(tenant)
	}

	private async getKeyUsage(tenant: Tenant): Promise<void> {
		const redisClient = this.redisService.getClient();

		const tenantUsage = await redisClient.get(`TENANT:${tenant.uuid}:${moment().subtract(1, 'm').minutes()}`) || 0;

		const apiKeys = await this.apiKeyRepository.createQueryBuilder('ApiKey')
			.getMany();

		apiKeys.forEach(async (key) => {
			const value = (await redisClient.get(`API_KEY_USAGE:${key.uuid}:${moment().subtract(1, 'm').minutes()}`)) || 0;

			this.apiKeyUsageRepository.save({
				value: Number(value),
				uuid: uuid.v4(),
				apiKeyUuid: key.uuid,
				createdAt: new Date(),
				updatedAt: new Date()
			});
		})
	}

	public async find(page = 1, pagesize = 20): Promise<Paginated<ApiKey>> {
		const query = this.apiKeyRepository.createQueryBuilder('ApiKey')
			.leftJoinAndSelect('ApiKey.permissions', 'Permission')
			.leftJoinAndSelect('ApiKey.usage', 'Usage');

		const aggregationQuery = this.apiKeyUsageRepository.createQueryBuilder('ApiKeyUsage')
			.select(`date_trunc('minute', ApiKeyUsage.createdAt) AS minute, sum(value) as valueSum`)
			.groupBy('minute')
			.execute();

		const [embedded, aggregation, totalEntities] = await Promise.all([
			query
				.skip((page - 1) * pagesize)
				.take(pagesize)
				.getMany(),
			aggregationQuery,
			query.getCount()
		])

		const total = (aggregation || [])
			.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
			.map((x) => ({
				name: x.minute,
				value: x.valuesum
			}))

		return {
			_aggregation: total,
			_embedded: embedded,
			_page: {
				totalEntities,
				currentPage: page,
				itemsPerPage: pagesize,
			},
		};
	}

	public findOne(search: any): Promise<ApiKey | undefined> {
		return this.apiKeyRepository.findOne(search);
	}

	public async create(apiKey: any): Promise<ApiKey> {
		apiKey.permissions = Object.keys(apiKey.permissions).reduce((acc, permissionKey) => {
			const permissionEnabled = apiKey.permissions[permissionKey];
			if (permissionEnabled) {
				return [
					...acc,
					{
						uuid: uuid.v4(),
						permission: permissionKey,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				];
			}

			return acc;
		}, []);

		const createdApiKey = await this.apiKeyRepository.save({
			...apiKey,
		});

		return createdApiKey;
	}

	public async update(id: string, apiKey: ApiKey): Promise<ApiKey> {
		const redisClient = this.redisService.getClient();

		// First we find the current fields and kill em off
		await this.apiKeyPermissionRepository.delete({
			apiKeyUuid: id,
		});

		apiKey.permissions = Object.keys(apiKey.permissions).reduce((acc, permissionKey) => {
			const permissionEnabled = apiKey.permissions[permissionKey];
			if (permissionEnabled) {
				return [
					...acc,
					{
						uuid: uuid.v4(),
						permission: permissionKey,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				];
			}

			return acc;
		}, []);
		apiKey.uuid = id;

		const updatedApiKey = await this.apiKeyRepository.save(apiKey);
		const { key } = await this.apiKeyRepository.findOne(apiKey.uuid);
		redisClient.del(`API_KEY:${key}`);

		return updatedApiKey;
	}

	public async delete(id: string): Promise<void> {
		await this.apiKeyRepository.delete(id);
		return;
	}

}
