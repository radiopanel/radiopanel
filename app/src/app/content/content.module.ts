import { MomentModule } from 'ngx-moment';

import { DragulaModule } from 'ng2-dragula';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';

import { UiModule } from '../../lib/ui/ui.module';
import { Components } from './components';
import { ContentRoutingModule } from './content-routing.module';
import { Modals } from './modals';
import { Pages } from './pages';
import { StoreServices, Stores, Queries } from './store';
import { Forms } from './forms';

@NgModule({
	declarations: [
		Components,
		Modals,
		Pages,
		Forms,
	],
	imports: [
		DragulaModule,
		CommonModule,
		ContentRoutingModule,
		RouterModule,
		UiModule,
		ReactiveFormsModule,
		MomentModule,
		MatDialogModule,
	],
	entryComponents: [
		Modals,
	],
	providers: [
		StoreServices,
		Stores,
		Queries,
	]
})
export class ContentModule { }
