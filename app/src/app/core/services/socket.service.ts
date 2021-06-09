import * as ioClient from 'socket.io-client';

import { Injectable } from '@angular/core';

@Injectable()
export class SocketService {
	public socket: SocketIOClient.Socket;

	public bootstrapSockets() {
		const socket = ioClient({
			transports: ['websocket'],
		});

		this.socket = socket;

		socket.on('connect', () => {
			socket.emit('authenticate');
		});
	}
}
