
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import {
	Tenant,
	User,
	UserRole,
	Role,
	RolePermission,
	Webhook,
	AuditLog,
	ApiKey,
	ApiKeyPermission,
	Slot,
	UserMeta,
	UserPermission,
	Ban,
	SlotOverwrite,
	ApiKeyUsage,
	AuthenticationMethod,
	ContentType,
	PageType,
	ContentTypeField,
	PageTypeField,
	Content,
	Page
} from '~entities';

import { WebhookInterceptor } from '../core/interceptors/webhook.interceptor';
import { AuditLogInterceptor } from '../core/interceptors/audit-log.interceptor';

import { TenantService } from './services/tenant.service';
import { Helpers } from './helpers';
import { Guards } from './guards';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { WebhookService } from './services/webhook.service';
import { AuditLogService } from './services/audit-log.service';
import { ApiKeyService } from './services/api-key.service';
import { SlotService } from './services/slot.service';
import { PermissionService } from './services/permission.service';
import { BanService } from './services/ban.service';
import { AuthMethodService } from './services/auth-method.service';
import { ContentTypeService } from './services/content-type.service';
import { PageTypeService } from './services/page-type.service';
import { PopulationService } from './services/population.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Tenant,
			SlotOverwrite,
			User,
			UserRole,
			Role,
			RolePermission,
			Webhook,
			AuditLog,
			ApiKey,
			ApiKeyPermission,
			ApiKeyUsage,
			Slot,
			UserMeta,
			Ban,
			UserPermission,
			AuthenticationMethod,
			ContentType,
			PageType,
			ContentTypeField,
			PageTypeField,
			Content,
			Page
		]),
		ConfigModule
	],
	providers: [
		...Helpers,
		...Guards,

		// Services
		TenantService,
		UserService,
		RoleService,
		WebhookService,
		AuditLogService,
		ApiKeyService,
		SlotService,
		PermissionService,
		BanService,
		AuthMethodService,
		ContentTypeService,
		PageTypeService,
		PopulationService,

		// Interceptors
		{
			provide: APP_INTERCEPTOR,
			useClass: WebhookInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AuditLogInterceptor,
		},
	],
	exports: [
		...Helpers,
		...Guards,

		// Services
		TenantService,
		UserService,
		RoleService,
		WebhookService,
		AuditLogService,
		ApiKeyService,
		SlotService,
		PermissionService,
		BanService,
		AuthMethodService,
		ContentTypeService,
		PageTypeService,
		PopulationService,

		// Modules
		ConfigModule,
	]
})
export class SharedModule {}
