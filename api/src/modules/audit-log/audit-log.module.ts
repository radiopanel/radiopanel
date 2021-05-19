import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLog } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { AuditLogController } from './controllers/audit-log.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([AuditLog]),
		SharedModule
	],
	controllers: [AuditLogController],
	providers: [],
})
export class AuditLogModule {}
