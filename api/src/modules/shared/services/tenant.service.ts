import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Brackets } from 'typeorm';
import { map, omit, pick } from 'ramda';
import * as uuid from 'uuid';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Tenant } from '~entities';

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class TenantService {
	@WebSocketServer() private server: any

	constructor(
    	@InjectRepository(Tenant) private tenantsRepository: Repository<Tenant>,
	) { }

	public async find(page = 1, pagesize = 20, search = null, includeInvoices = false): Promise<any> {
		const query = this.tenantsRepository.createQueryBuilder('Tenant')

		if (search) {
			query
				.andWhere(new Brackets(qb => qb
					.where('Tenant.name LIKE :search', { search: `%${search}%` })
					.orWhere('Tenant.url LIKE :search', { search: `%${search}%` })))
		}

		if (includeInvoices) {
			query
				.leftJoinAndSelect('Tenant.invoices', 'Invoice')
				.leftJoinAndSelect('Invoice.history', 'History')
				.orderBy('History.createdAt', 'DESC')
		}

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

	public async findTenantByHostname(hostName: string): Promise<any> {
		return this.tenantsRepository.createQueryBuilder('Tenant')
			.where(`"Tenant"."settings"->>'customHost' = :hostName`, { hostName })
			.getOne();
	}

	public async findOne(): Promise<Tenant | undefined> {
		return this.tenantsRepository.createQueryBuilder('Tenant')
			.getOne();
	}

	public async create(tenant: Partial<Tenant>): Promise<Tenant> {
		const newTenant = await this.tenantsRepository.save(tenant);
		return newTenant;
	}

	public update(id: string, tenant: Tenant): Promise<Tenant> {
		tenant.uuid = id;
		this.server.to('authenticated-users').emit('tenant-updated');
		return this.tenantsRepository.save(tenant);
	}

	public async delete(id: string): Promise<void> {
		await this.tenantsRepository.delete(id);
		return;
	}
}
