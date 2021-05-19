import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { NgxPaginationModule } from 'ngx-pagination';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { UiModule } from '../../lib/ui/ui.module';
import { Pages } from './pages';
import { Queries, Stores, StoreServices } from './store';
import { SongRoutingModule } from './song-routing.module';

@NgModule({
	declarations: [
		Pages,
	],
	imports: [
		CommonModule,
		SongRoutingModule,
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
export class SongModule { }
