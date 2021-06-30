
import session from 'express-session';
import redis from 'redis'

const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT)
});

export const sessionMiddleware = session({
	store: new RedisStore({ client: redisClient }),
	secret: process.env.JWT_PRIVATE,
	resave: false,
	saveUninitialized: false,
	name: 'radiopanel.session.sid',
	rolling: true, // <-- Set `rolling` to `true`
	cookie: {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	}
})