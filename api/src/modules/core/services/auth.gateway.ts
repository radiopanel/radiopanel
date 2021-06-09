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
			(userData.tenants || []).forEach(async (tenant: Tenant) => {
				try {
					this.server.of('/').adapter.remoteJoin(client.id, tenant.uuid);
				} catch (e) {}
			})
		} catch (e) {
			return
		}
		return;
	}

	@SubscribeMessage('authenticate-client')
	public async handleClientAuthentication(
		@MessageBody() data: any,
		@ConnectedSocket() client: Socket,
	): Promise<any> {
		if (!data.apiKey || !data.tenant) {
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
					this.server.of('/').adapter.remoteJoin(client.id, `${data.tenant}/${permission.permission}`);
				} catch (e) {}
			});
			
			client.emit('auth-ok', {
				rooms: (apiKeyData.permissions || []).map((x) => `${data.tenant}/${x.permission}`)
			});
		} catch (e) {
			return
		}

		return;
	}
}
