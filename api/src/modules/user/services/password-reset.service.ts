import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as uuid from 'uuid';
import { Repository } from "typeorm";

import { User, PasswordReset } from "~entities";
import { MailHelper } from "~shared/helpers/MailHelper";

@Injectable()
export class PasswordResetService {

	constructor(
		@InjectRepository(PasswordReset) private passwordResetRepository: Repository<PasswordReset>,
		private mailHelper: MailHelper
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
		return await this.mailHelper.sendMail({
			to: passwordReset.emailAddress,
			subject: `Reset your password`,
			context: { passwordReset, user },
			template: 'passwordReset',
		});
	}

	public async delete(passwordResetUuid: string): Promise<void> {
		await this.passwordResetRepository.delete(passwordResetUuid);
		return;
	}
}
