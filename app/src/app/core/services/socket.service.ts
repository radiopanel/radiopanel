import { ToastrService } from 'ngx-toastr';
import { prop, path, propOr } from 'ramda';
import { throwError } from 'rxjs';
import { catchError, tap, first } from 'rxjs/operators';
import * as ioClient from 'socket.io-client';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SessionService, SessionQuery } from '~lib/store';

@Injectable()
export class SocketService {
	public socket: SocketIOClient.Socket;

	public bootstrapSockets() {
		const socket = ioClient({
			transports: ['websocket']
		});

		this.socket = socket;

		socket.on('connect', () => {
			socket.emit('authenticate', localStorage.getItem('token'));
		});
	}
}
