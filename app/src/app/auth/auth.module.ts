import { MomentModule } from 'ngx-moment';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { RouterModule } from '@angular/router';

import { UiModule } from '~lib/ui/ui.module';
import { AuthRoutingModule } from './auth-routing.module';
import { Pages } from './pages';
import { Queries, Stores, StoreServices } from './store';

@NgModule({
	declarations: [
		Pages
	],
	imports: [
		CommonModule,
		AuthRoutingModule,
		RouterModule,
		UiModule,
		ReactiveFormsModule,
		MomentModule,
		MatDialogModule,
		RecaptchaModule,
		RecaptchaFormsModule
	],
	providers: [
		Queries,
		Stores,
		StoreServices,
	],
})
export class AuthModule { }
