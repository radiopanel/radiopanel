/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";
import got from 'got';
import { prop } from "ramda";

import { Webhook } from "~entities";
import { Paginated } from "~shared/types";
import { discordTransform } from "~shared/helpers/discordTransform";

import { TenantService } from "./tenant.service";

@Injectable()
export class WebhookService {
	constructor(
		@InjectRepository(Webhook) private webhookRepository: Repository<Webhook>,
		private tenantService: TenantService,
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<Webhook>> {
		const query = this.webhookRepository.createQueryBuilder('Webhook')

		return {
			_embedded: await query
				.skip((page - 1) * pagesize)
				.take(pagesize)
				.getMany(),
			_page: {
				totalEntities: await query.getCount(),
				currentPage: page,
				itemsPerPage: pagesize,
			},
		};
	}

	public async executeWebhook(type: string, data: any): Promise<void> {
		const tenant = await this.tenantService.findOne()

		const hooks = await this.webhookRepository.createQueryBuilder('Webhook')
			.andWhere('Webhook.type = :type', { type })
			.getMany();

		hooks.forEach((hook) => {
			if (hook.destination === "discord") {
				if (!prop(hook.type)(discordTransform)) {
					return;
				}

				got.post(hook.url, {
					json: {
						embeds: [{
							...prop(hook.type)(discordTransform)(data),
							author: {
								name: tenant.name,
								icon_url: tenant?.settings?.logo
							},
							color: parseInt(tenant?.settings?.primaryColor.replace('#', ''), 16),
						}]
					}
				}).catch(() => {
					// Swallow
				})
				return;
			}

			got.post(hook.url, {
				json: {
					type,
					data
				},
			})
		});

	}

	public findOne(webhookUuid: string): Promise<Webhook | undefined> {
		return this.webhookRepository.findOne({
			uuid: webhookUuid
		});
	}

	public async create(webhook: Webhook): Promise<Webhook> {
		const createdWebhook = await this.webhookRepository.save({
			uuid: uuid.v4(),
			...webhook,
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		return createdWebhook;
	}

	public async update(webhookUuid: string, webhook: Webhook): Promise<Webhook> {
		webhook.uuid = webhookUuid;
		const updatedWebhook = await this.webhookRepository.save(webhook);

		return updatedWebhook;
	}

	public async delete(webhookUuid: string): Promise<void> {
		await this.webhookRepository.delete({
			uuid: webhookUuid,
		});
		return;
	}
}
