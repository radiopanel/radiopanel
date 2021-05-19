import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { UiModule } from '~lib/ui/ui.module';
import { Pages } from './pages';
import { Modals } from './modals';
import { Queries, Stores, StoreServices } from './store';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
	declarations: [
		Pages,
		Modals,
	],
	imports: [
		CommonModule,
		UsersRoutingModule,
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
export class UsersModule { }
