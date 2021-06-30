import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { User, PasswordReset } from "~entities";
import { MailHelper } from "~shared/helpers/MailHelper";
import { TenantService } from "~shared/services/tenant.service";

@Injectable()
export class PasswordResetService {

	constructor(
		@InjectRepository(PasswordReset) private passwordResetRepository: Repository<PasswordReset>,
		private mailHelper: MailHelper,
		private tenantService: TenantService,
	) { }

	public findOne(search: any): Promise<PasswordReset | undefined> {
		return this.passwordResetRepository.findOne(search);
	}

	public async create(passwordReset: PasswordReset): Promise<PasswordReset> {
		return await this.passwordResetRepository.save({
			uuid: uuid.v4(),
			...passwordReset,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
	}

	public async sendPasswordResetMail(passwordReset: PasswordReset, user: User): Promise<void> {
		const tenant = await this.tenantService.findOne();

		return await this.mailHelper.sendMail({
			to: passwordReset.emailAddress,
			subject: `Reset your password`,
			context: { passwordReset, user },
			template: 'passwordReset',
			tenant,
		});
	}

	public async delete(passwordResetUuid: string): Promise<void> {
		await this.passwordResetRepository.delete(passwordResetUuid);
		return;
	}
}
