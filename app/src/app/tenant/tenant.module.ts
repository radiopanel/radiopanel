import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { UiModule } from '~lib/ui/ui.module';
import { Pages } from './pages';
import { TenantRoutingModule } from './tenant-routing.module';
import { Queries, StoreServices, Stores } from './store';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
	declarations: [
		Pages,
	],
	imports: [
		CommonModule,
		TenantRoutingModule,
		RouterModule,
		UiModule,
		ReactiveFormsModule,
		ToastrModule,
		MatDialogModule,
		MomentModule,
		RecaptchaModule,
		RecaptchaFormsModule
	],
	providers: [
		Queries,
		Stores,
		StoreServices
	],
})
export class TenantModule { }
