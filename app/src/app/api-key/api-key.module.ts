import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { UiModule } from '~lib/ui/ui.module';
import { Pages } from './pages';
import { ApiKeyRoutingModule } from './api-key-routing.module';
import { Queries, Stores, StoreServices } from './store';

@NgModule({
	declarations: [
		Pages
	],
	imports: [
		CommonModule,
		NgxChartsModule,
		ApiKeyRoutingModule,
		RouterModule,
		UiModule,
		ReactiveFormsModule,
		ToastrModule,
		MatDialogModule,
		MomentModule,
	],
	providers: [
		Queries,
		Stores,
		StoreServices
	],
})
export class ApiKeyModule { }
