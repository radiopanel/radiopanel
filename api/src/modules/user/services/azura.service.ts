/* eslint-disable @typescript-eslint/camelcase */
import crypto from 'crypto';

import { Injectable } from "@nestjs/common";
import got from 'got';
import slugify from "slugify";

import { TenantService } from "~shared/services/tenant.service";

@Injectable()
export class AzuraService {

	constructor(
		private tenantService: TenantService
	) { }

	public async findUsers(page: number, pagesize: number) {
		const { settings } = await this.tenantService.findOne();

		return got.get(`${settings?.azuraCastBaseUrl}/api/station/${settings?.azuraCastStationId}/streamers`, {
			resolveBodyOnly: true,
			responseType: 'json',
			headers: {
				'X-Api-Key': settings?.azuraCastApiKey
			}
		})
	}

	public async createUser(fullName: string) {
		const { settings } = await this.tenantService.findOne();

		const createdAzuraUser = await got.post<any>(`${settings?.azuraCastBaseUrl}/api/station/${settings?.azuraCastStationId}/streamers`, {
			resolveBodyOnly: true,
			responseType: 'json',
			headers: {
				'X-Api-Key': settings?.azuraCastApiKey
			},
			json: {
				streamer_username: slugify(fullName).toLowerCase() + "-" + crypto.randomBytes(2).toString('hex'),
				streamer_password: crypto.randomBytes(20).toString('hex'),
				display_name: fullName,
				comment: 'Auto generated account by RadioPanel.co',
				is_active: true,
				enforce_schedule: false,
			}
		});

		return {
			...createdAzuraUser,
			streamer_password: crypto.randomBytes(10).toString('hex'),
		}
	}

	public async deleteUser(azuraUserId: string) {
		const { settings } = await this.tenantService.findOne();
		try {
			await got.delete<any>(`${settings?.azuraCastBaseUrl}/api/station/${settings?.azuraCastStationId}/streamer/${azuraUserId}`, {
				resolveBodyOnly: true,
				responseType: 'json',
				headers: {
					'X-Api-Key': settings?.azuraCastApiKey
				},
			});
		} catch (e) {}

		return;
	}
}
