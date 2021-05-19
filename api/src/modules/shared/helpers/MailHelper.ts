import * as fs from 'fs';
import * as path from 'path';

import nodemailer from 'nodemailer';
import { compile } from 'handlebars';
import mjml2html from 'mjml';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


interface MailArguments {
	to: string;
	template: string;
	context: any;
	tenant?: string;
	subject: string;
}

@Injectable()
export class MailHelper {
	constructor(
		private configService: ConfigService,
	) {}

	public async sendMail({
		to, template, context, subject,
	}: MailArguments): Promise<void> {
		const mailTemplate = compile(fs.readFileSync(path.join(process.cwd(), `src/mail/templates/${template}.mjml`)).toString());
		const html = mjml2html(mailTemplate({ ...context, config: {
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
			from: '"RadioPanel" <info@radiopanel.co>',
			to,
			subject,
			html,
		});
	}
}
