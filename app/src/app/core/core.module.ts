import { DragulaModule } from 'ng2-dragula';
import { MomentModule } from 'ngx-moment';
import { ToastrModule } from 'ngx-toastr';
import { TooltipModule } from 'ng2-tooltip-directive';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { GridsterModule } from 'angular-gridster2';

import { environment } from '../../environments/environment';
import { StoreModule } from '~lib/store/store.module';
import { UiModule } from '~lib/ui/ui.module';
import { Components, CoreComponent, EntryComponents, ToastComponent } from './components';
import { AppRoutingModule } from './core-routing.module';
import { Guards } from './guards';
import { Interceptors, TokenInterceptor, HttpErrorInterceptor } from './interceptors';
import { Pages } from './pages';
import { Services } from './services';
import { Modals } from './modals';
import { Queries, Stores, StoreServices } from './store';
import { ReactiveFormsModule } from '@angular/forms';

export function tokenGetter() {
	return localStorage.getItem('token');
}

@NgModule({
	declarations: [
		Components,
		Pages,
		Modals
	],
	imports: [
		TooltipModule,
		BrowserModule,
		AppRoutingModule,
		RouterModule,
		UiModule,
		HttpClientModule,
		DragDropModule,
		BrowserAnimationsModule,
		environment.production ? [] : AkitaNgDevtools.forRoot(),
		AkitaNgRouterStoreModule.forRoot(),
		DragulaModule.forRoot(),
		StoreModule,
		NgScrollbarModule,
		ReactiveFormsModule,
		GridsterModule,
		ToastrModule.forRoot({
			positionClass: 'toast-bottom-right',
			disableTimeOut: false,
			closeButton: true,
			progressBar: true,
			toastComponent: ToastComponent,
			toastClass: 'm-toast',
			iconClasses: {
				error: 'm-toast--error',
				info: 'm-toast--info',
				success: 'm-toast--success',
				warning: 'm-toast--warning'
			}
		}),
		MomentModule,
		JwtModule.forRoot({
			config: {
				tokenGetter
			}
		}),
	],
	providers: [
		{ provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' } },
		{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
		Queries,
		Stores,
		StoreServices,
		Services,
		Guards,
		Interceptors,
	],
	bootstrap: [CoreComponent],
	entryComponents: [
		EntryComponents
	]
})
export class CoreModule { }
