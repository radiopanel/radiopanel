import { Strategy as LocalStrategy } from "passport-local";
import { Inject, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import passport from "passport";
import { NextFunction, Request, Response } from "express";

import { UserService } from "~shared/services/user.service";
import { User } from "~entities";

@Injectable()
export class LocalStrategyProvider implements NestMiddleware {
	constructor(
		private userService: UserService
	) {}

	public async use(req: Request, res: Response, next: NextFunction) {
		const strategy = await this.getConfiguration();

		passport.authenticate(strategy)(req, res, next);
	}

	private async getConfiguration(): Promise<LocalStrategy> {
		return new LocalStrategy(
			{
				usernameField: 'email'
			},
			async (email: string, password: string, done: Function): Promise<any> => {
				const user = await this.userService.findOne({ email });

				if (!user) {
					done(null, false, { message: 'Please make sure all your details are correct' });
				}

				const isValidUser = await User.comparePassword(user, password);

				if (!isValidUser) {
					done(null, false, { message: 'Please make sure all your details are correct' });
				}

				done(null, await this.userService.findOne({ uuid: user.uuid }))
			}
		);
	}
}
