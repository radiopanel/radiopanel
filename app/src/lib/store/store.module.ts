import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';

import { Queries, Stores, StoreServices } from './index';

@NgModule({
	imports: [
		BrowserModule,
		RouterModule,
		HttpClientModule,
		BrowserAnimationsModule,
	],
	providers: [
		{ provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' } },
		Queries,
		Stores,
		StoreServices
	],
})
export class StoreModule { }
