import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository, MoreThan } from "typeorm";
import moment from 'moment';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Request } from "~entities";
import { Paginated } from "~shared/types";
import { TenantService } from "~shared/services/tenant.service";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class RequestService {
	@WebSocketServer() private server: any

	constructor(
		@InjectRepository(Request) private requestRepository: Repository<Request>,
		private tenantService: TenantService
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<Request>> {
		const query = this.requestRepository.createQueryBuilder('Request')
			.andWhere('Request.deletedAt IS NULL')
			.orderBy('Request.createdAt', 'DESC');

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

	public findOne(search: any): Promise<Request | undefined> {
		return this.requestRepository.findOne(search);
	}

	public async findRecent(requestContext: string): Promise<Request | undefined> {
		const tenant = await this.tenantService.findOne();

		return this.requestRepository.findOne({
			requestContext,
			createdAt: MoreThan(moment().subtract(tenant?.settings?.requestTimeout || 15, 'minutes').toDate())
		});
	}

	public async create(request: Request): Promise<Request> {
		this.server.emit('requests-updated');
		return await this.requestRepository.save({
			uuid: uuid.v4(),
			...request,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	public update(id: string, request: Request): Promise<Request> {
		request.uuid = id;
		request.updatedAt = new Date();

		return this.requestRepository.save(request);
	}

	public async delete(requestUuid: string): Promise<void> {
		const request = await this.requestRepository.findOne(requestUuid);
		request.deletedAt = new Date();
		await this.requestRepository.save(request);
		return;
	}

	public async clear(): Promise<void> {
		const requests = await this.requestRepository.find();

		requests.forEach((request) => {
			request.deletedAt = new Date();
			this.requestRepository.save(request);
		})

		return;
	}
}
