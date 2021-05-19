import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Tenant, Invite, PasswordReset, Role, RolePermission, UserRole } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { ApiKeyController } from './controllers/api-key.controller';

@Module({
	imports: [
		// TypeOrmModule.forFeature([]),
		SharedModule
	],
	controllers: [ApiKeyController],
	providers: [],
})
export class ApiKeyModule {}
