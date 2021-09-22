import { join } from 'path';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule} from 'nestjs-redis';

// eslint-disable-next-line import/namespace
import { ServeStaticModule } from '@nestjs/serve-static';

import * as ormConfig from './ormconfig';
import { config } from './config';
import { TenantModule } from './modules/tenant/tenant.module';
import { ResourceModule } from './modules/resource/resource.module';
import { UserModule } from './modules/user/user.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CoreModule } from './modules/core/core.module';
import { SlotModule } from './modules/slot/slot.module';
import { SlotTypeModule } from './modules/slot-type/slot-type.module';
import { RequestModule } from './modules/request/request.module';
import { BannerModule } from './modules/banner/banner.module';
import { RuleModule } from './modules/rule/rule.module';
import { SongModule } from './modules/song/song.module';
import { FormModule } from './modules/form/form.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';
import { ContentModule } from './modules/content/content.module';
import { PageModule } from './modules/page/page.module';
import { ImagingModule } from './modules/imaging/banner.module';
import { BanModule } from './modules/ban/ban.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(ormConfig),
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			load: [config],
		}),
		RedisModule.register({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT)
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '../../', 'uploads'),
			serveRoot: '/uploads'
		}),

		// Modules
		CoreModule,
		AuthModule,
		DashboardModule,
		ResourceModule,
		TenantModule,
		UserModule,
		SlotModule,
		SlotTypeModule,
		RequestModule,
		BannerModule,
		RuleModule,
		SongModule,
		FormModule,
		WebhookModule,
		AuditLogModule,
		ApiKeyModule,
		ContentModule,
		PageModule,
		ImagingModule,
		BanModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
