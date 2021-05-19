import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RulePage } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { RulePageController } from './controllers/rule-page.controller';
import { RulePageService } from './services/rule-page.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([RulePage]),
		SharedModule
	],
	controllers: [RulePageController],
	providers: [RulePageService],
})
export class RuleModule {}
