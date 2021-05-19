import { IncomingMessage } from 'http';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { propOr } from 'ramda';

export const User = createParamDecorator(// tslint:disable-line variable-name
	(path: string[] = [], context: ExecutionContext): unknown => {
		const request = context.switchToHttp().getRequest() as IncomingMessage;

		const jwtResult = jwt.decode(request.headers.authorization.replace('Bearer ', '')) as any;

		return propOr(null, 'user')(jwtResult);
	}
);
