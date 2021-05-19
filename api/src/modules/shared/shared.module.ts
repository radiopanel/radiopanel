
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { makeGaugeProvider } from '@willsoto/nestjs-prometheus';

import { Tenant, User, UserRole, Role, RolePermission, Webhook, AuditLog, ApiKey, ApiKeyPermission, Slot, UserMeta, UserPermission, Ban, SlotOverwrite, ApiKeyUsage } from '~entities';

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

		// Interceptors
		{
			provide: APP_INTERCEPTOR,
			useClass: WebhookInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AuditLogInterceptor,
		},

		makeGaugeProvider({
			name: "radiopanel_tenant_usage",
			help: "TODO",
			labelNames: ['tenant_uuid', 'tenant_slug']
		}),
		makeGaugeProvider({
			name: "radiopanel_api_key_usage",
			help: "TODO",
			labelNames: ['tenant_uuid', 'tenant_slug', 'key']
		}),
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

		// Modules
		ConfigModule
	]
})
export class SharedModule {}
