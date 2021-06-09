import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'socket.io';
import sharedSession from 'express-socket.io-session'
import { sessionMiddleware } from '../helpers/session';
import { INestApplication } from '@nestjs/common';

/**
 * Enable session tokens for web sockets by using express-socket.io-session
 */
export class SessionAdapter extends IoAdapter {
	private app : INestApplication;

	constructor(app : INestApplication) {
		super(app)
		this.app = app
	}

	createIOServer(port: number, options?: any): any {
		const server : Server = super.createIOServer(port, options);

		server.use(sharedSession(sessionMiddleware, {
			autoSave:true
		}));
		
		return server;
	}
}
