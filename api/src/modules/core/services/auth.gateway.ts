import { Injectable } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { ConfigService } from "@nestjs/config";
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

import { ApiKeyPermission, Tenant } from "~entities";
import { UserService } from "~shared/services/user.service";
import { PermissionService } from "~shared/services/permission.service";

@Injectable()
@WebSocketGateway({ port: process.env.PORT, transports: ['polling', 'websocket'] })
export class AuthGateway {
	@WebSocketServer() private server: any

	constructor(
		public configService: ConfigService,
		public permissionService: PermissionService,
		public userService: UserService,
	) {}

	@SubscribeMessage('authenticate')
	public async handleSocketAuthentication(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	): Promise<void> {
		if (!(client.handshake as any)?.session?.passport?.user?.uuid) {
			return;
		}

		try {
			const userData = await this.userService.findOne({ uuid: (client.handshake as any)?.session?.passport?.user?.uuid });

			if (!userData) {
				return;
			}

			client.join('authenticated-users');
			client.emit('auth-ok', {
				rooms: ['authenticated-users']
			});
		} catch (e) {
			console.error(e)
			return
		}
		return;
	}

	@SubscribeMessage('authenticate-client')
	public async handleClientAuthentication(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	): Promise<any> {
		if (!data.apiKey) {
			return client.emit('missing-data');
		}

		try {
			const buff = Buffer.from(data.apiKey, 'base64');
			const key = buff.toString('ascii').split(':')[0];
			const apiKeyData = await this.permissionService.getApiKeyData(key)

			if (!apiKeyData) {
				return client.emit('wrong-key');
			}

			(apiKeyData.permissions || []).forEach((permission: ApiKeyPermission) => {
				try {
					client.join(`authenticated-clients/${permission.permission}`);
				} catch (e) {
					console.error(e)
				}
			});

			client.emit('auth-ok', {
				rooms: (apiKeyData.permissions || []).map((x) => `authenticated-clients/${x.permission}`)
			});
		} catch (e) {
			console.error(e)
			return
		}

		return;
	}
}
