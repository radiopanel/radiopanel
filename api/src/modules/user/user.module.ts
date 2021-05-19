import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Tenant, Invite, PasswordReset, Role, RolePermission, UserRole } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { InviteService } from './services/invite.service';
import { PasswordResetService } from './services/password-reset.service';
import { AzuraService } from './services/azura.service';
import { AuthController } from './controllers/auth.controller';
import { InviteController } from './controllers/invite.controller';
import { PermissionController } from './controllers/permission.controller';
import { RoleController } from './controllers/role.controller';
import { UserController } from './controllers/user.controller';
import { ProfileController } from './controllers/profile.controller';
import { AzuraController } from './controllers/azura.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, Tenant, Invite, PasswordReset, Role, RolePermission, UserRole]),
		SharedModule
	],
	controllers: [AuthController, InviteController, PermissionController, RoleController, UserController, ProfileController, AzuraController],
	providers: [InviteService, PasswordResetService, AzuraService],
})
export class UserModule {}
