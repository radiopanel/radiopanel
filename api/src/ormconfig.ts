import {ConnectionOptions} from 'typeorm';
import { LoggerOptions } from 'typeorm/logger/LoggerOptions';

import { Entities } from '~entities';


// Check typeORM documentation for more information.
const config: ConnectionOptions = {
	type: process.env.TYPEORM_CONNECTION as "postgres",
	host: process.env.TYPEORM_HOST,
	port: Number(process.env.TYPEORM_PORT),
	username: process.env.TYPEORM_USERNAME,
	password: process.env.TYPEORM_PASSWORD,
	database: process.env.TYPEORM_DATABASE,
	entities: [...Entities],
	// ...(process.env.TYPEORM_SSL === "true" && {ssl: {
	// 	rejectUnauthorized: false,
	// }}),

	// We are using migrations, synchronize should be set to false.
	synchronize: false,
	migrationsRun: true,

	// Run migrations automatically,
	// you can disable this if you prefer running migration manually.
	// migrationsRun: true,
	logging: process.env.TYPEORM_LOGGING as LoggerOptions,

	// allow both start:prod and start:dev to use migrations
	// __dirname is either dist or src folder, meaning either
	// the compiled js in prod or the ts in dev
	migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
	cli: {
		migrationsDir: 'src/database/migrations',
	},
};

export = config;
