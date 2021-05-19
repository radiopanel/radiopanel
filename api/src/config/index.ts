export const config = () => ({
	app: {
		frontendBaseUrl: process.env.FRONTEND_BASEURL
	},
	jwt: {
		privateKey: process.env.JWT_PRIVATE,
	},
	db: {
		type: process.env.TYPEORM_CONNECTION,
		host: process.env.TYPEORM_HOST,
		port: Number(process.env.TYPEORM_PORT),
		username: process.env.TYPEORM_USERNAME,
		password: process.env.TYPEORM_PASSWORD,
		database: process.env.TYPEORM_DATABASE,
		synchronize: process.env.TYPEORM_SYNCHRONIZE,
		logging: process.env.TYPEORM_LOGGING,
		ssl: Boolean(process.env.TYPEORM_SSL),
	},
	mail: {
		host: process.env.MAIL_HOST,
		port: Number(process.env.MAIL_PORT),
		secure: Boolean(process.env.MAIL_SECURE),
		user: process.env.MAIL_USER,
		password: process.env.MAIL_PASSWORD,
	}
});
