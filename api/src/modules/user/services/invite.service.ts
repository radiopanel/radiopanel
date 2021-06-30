import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { Invite, User, Tenant } from "~entities";
import { MailHelper } from "~shared/helpers/MailHelper";
import { Paginated } from "~shared/types";

@Injectable()
export class InviteService {

	constructor(
		@InjectRepository(Invite) private inviteRepository: Repository<Invite>,
		private mailHelper: MailHelper,
	) { }

	public async find(page = 1, pagesize = 20): Promise<Paginated<Invite>> {
		const query = this.inviteRepository.createQueryBuilder('Invite')
			.leftJoinAndSelect('Invite.role', 'Role')

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

	public findOne(search: any): Promise<Invite | undefined> {
		return this.inviteRepository.findOne(search);
	}

	public async create(invite: Invite): Promise<Invite> {
		return await this.inviteRepository.save({
			uuid: uuid.v4(),
			...invite,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	public async sendRegistrationInviteMail(tenant: Tenant, invite: Invite): Promise<void> {
		return await this.mailHelper.sendMail({
			to: invite.emailAddress,
			subject: `You have been invited to collaborate on ${tenant.name}`,
			context: { tenant, env: {}, invite },
			template: 'registrationInvite',
			tenant,
		});
	}

	public async sendTenantInviteMail(tenant: Tenant, invite: Invite, user: User): Promise<void> {
		return await this.mailHelper.sendMail({
			to: invite.emailAddress,
			subject: `You have been invited to collaborate on ${tenant.name}`,
			context: { tenant, env: {}, invite, user },
			template: 'tenantInvite',
			tenant,
		});
	}

	public async delete(inviteUuid: string): Promise<void> {
		await this.inviteRepository.delete(inviteUuid);
		return;
	}
}
