import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '~shared/shared.module';
import { Tenant } from '~entities';

import { TenantController } from './controllers/tenant.controller'

@Module({
	imports: [SharedModule, TypeOrmModule.forFeature([Tenant])],
	controllers: [TenantController],
})
export class TenantModule {}
