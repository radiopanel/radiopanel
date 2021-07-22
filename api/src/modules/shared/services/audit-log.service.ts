import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { AuditLog } from "~entities";
import { Paginated } from "~shared/types";

@Injectable()
export class AuditLogService {
	constructor(
		@InjectRepository(AuditLog) private auditLogRepository: Repository<AuditLog>,
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<AuditLog>> {
		const query = this.auditLogRepository.createQueryBuilder('AuditLog')
			.leftJoinAndSelect('AuditLog.user', 'User')
			.leftJoinAndSelect('User._userMeta', 'UserMeta')
			.orderBy('AuditLog.createdAt', 'DESC')

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

	public findOne(webhookUuid: string): Promise<AuditLog | undefined> {
		return this.auditLogRepository.findOne({
			uuid: webhookUuid
		});
	}

	public async log(userUuid: string, action: string, actionData: any, actionContext: any): Promise<any> {
		return this.auditLogRepository.save({
			uuid: uuid.v4(),
			userUuid,
			action,
			actionData,
			actionContext,
			createdAt: new Date(),
			updatedAt: new Date(),
		})
	}
}
