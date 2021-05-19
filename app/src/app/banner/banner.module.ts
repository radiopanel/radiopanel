import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { UiModule } from '../../lib/ui/ui.module';
import { Pages } from './pages';
import { BannerRoutingModule } from './banner-routing.module';
import { Queries, StoreServices, Stores } from './store';

@NgModule({
	declarations: [
		Pages,
	],
	imports: [
		CommonModule,
		BannerRoutingModule,
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
export class BannerModule { }
