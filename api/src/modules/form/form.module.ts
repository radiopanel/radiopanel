import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Form, FormField, FormEntry } from '~entities';
import { SharedModule } from '~shared/shared.module';

import { FormController } from './controllers/form.controller';
import { FormEntryController } from './controllers/form-entry.controller';
import { FormService } from './services/form.service';
import { FormEntryService } from './services/form-entry.service';
import { FormFieldController } from './controllers/form-field.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Form, FormField, FormEntry]),
		SharedModule
	],
	controllers: [FormController, FormEntryController, FormFieldController],
	providers: [FormService, FormEntryService]
})
export class FormModule {}
