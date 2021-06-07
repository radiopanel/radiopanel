import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import passport from 'passport';
import session from 'express-session';
import redis from 'redis'

import { AppModule } from './app.module';
import { TransformInterceptor } from './modules/core/interceptors/transform.interceptor';
import { RedisIoAdapter } from './modules/core/adapters/redis-io.adapter';

require('events').EventEmitter.defaultMaxListeners = 15;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const RedisStore = require('connect-redis')(session)
	const redisClient = redis.createClient({
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT)
	})

	app.use(helmet());
	app.use(session({
		store: new RedisStore({ client: redisClient }),
		secret: process.env.JWT_PRIVATE,
		resave: false,
		saveUninitialized: false,
	}))
	app.use(passport.initialize())
	app.use(passport.session())
	
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	app.useWebSocketAdapter(new RedisIoAdapter(app));
	app.useGlobalInterceptors(new TransformInterceptor());
	app.setGlobalPrefix('api/v1');
	app.enableCors({
		exposedHeaders: ['x-tenant'],
	});

	const options = new DocumentBuilder()
		.setTitle('RadioPanel')
		.setDescription('The RadioPanel API documentation, baseURL: https://api.radiopanel.co')
		.setVersion('1.0')
		.addBasicAuth()
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document);

	await app.listen(Number(process.env.PORT));
}

bootstrap();
