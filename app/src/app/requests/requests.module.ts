import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { UiModule } from '~lib/ui/ui.module';
import { Pages } from './pages';
import { Modals } from './modals';
import { Queries, Stores, StoreServices } from './store';
import { RequestsRoutingModule } from './requests-routing.module';

@NgModule({
	declarations: [
		Pages,
		Modals
	],
	imports: [
		CommonModule,
		RequestsRoutingModule,
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
	entryComponents: [
		Modals
	]
})
export class RequestsModule { }
