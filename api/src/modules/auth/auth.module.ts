import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Tenant, Invite, PasswordReset, Role, RolePermission, UserRole, AuthenticationMethod } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { Strategies } from '../auth/strategies';
import { AuthMethodController } from './controllers/auth-method.controller';
import { AuthController } from './controllers/auth.controller';
import { PasswordResetService } from './services/password-reset.service';
import { LocalStrategyProvider } from './strategies/local.strategy';
import { DynamicStrategyProvider } from './strategies/dynamic.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Tenant, Invite, PasswordReset, Role, RolePermission, UserRole, AuthenticationMethod]),
		SharedModule
	],
	controllers: [
		AuthController,
		AuthMethodController,
	],
	providers: [
		PasswordResetService,

		...Strategies
	],
})
export class AuthModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	  	consumer
			.apply(LocalStrategyProvider)
			.forRoutes('/auth/login/local')
			.apply(DynamicStrategyProvider)
			.forRoutes('/auth/login/*');
	}
}
