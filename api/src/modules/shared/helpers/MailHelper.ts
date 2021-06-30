import * as fs from 'fs';
import * as path from 'path';

import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAIL_TEMPLATES } from 'src/mail';
import { Tenant } from '~entities/tenant.entity';


interface MailArguments {
	to: string;
	template: string;
	context: any;
	tenant: Tenant;
	subject: string;
}

@Injectable()
export class MailHelper {
	constructor(
		private configService: ConfigService,
	) {}

	public async sendMail({
		to, template, context, subject, tenant,
	}: MailArguments): Promise<void> {
		const mailTemplate = compile(MAIL_TEMPLATES[template]);
		const html = mjml2html(mailTemplate({ ...context, config: {
			emailBackgroundColor: tenant.settings?.emailBackgroundColor || '#181818',
			emailBoxBackgroundColor: tenant.settings?.emailBoxBackgroundColor || '#292929',
			emailPrimaryColor: tenant.settings?.emailPrimaryColor || '#FF926B',
			emailSecondaryColor: tenant.settings?.emailSecondaryColor || '#E86856',
			emailTitleTextColor: tenant.settings?.emailTitleTextColor || '#FFFFFF',
			emailButtonTextColor: tenant.settings?.emailButtonTextColor || '#FFFFFF',
			emailTextColor: tenant.settings?.emailTextColor || '#e6e6e6',
			emailFooterTextColor: tenant.settings?.emailFooterTextColor || '#616161',
			emailLogo: tenant.settings?.emailLogo || '/assets/img/logo-monochrome-light.png',
			frontendBaseUrl: this.configService.get('app.frontendBaseUrl')
		}})).html;

		const transporter = nodemailer.createTransport({
			host: this.configService.get('mail.host'),
			port: this.configService.get('mail.port'),
			secure: this.configService.get('mail.secure'),
			auth: {
			  user: this.configService.get('mail.user'),
			  pass: this.configService.get('mail.password'),
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		return transporter.sendMail({
			from: tenant.settings?.emailFrom || '"RadioPanel" <info@radiopanel.co>',
			to,
			subject,
			html,
		});
	}
}
