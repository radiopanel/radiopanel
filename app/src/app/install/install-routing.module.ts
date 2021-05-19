import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';
import { AuthGuard } from '../core/guards';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'create-account'
	},
	{
		path: 'create-account',
		component: Pages.CreateAccountPageComponent
	},
	{
		path: 'create-station',
		component: Pages.CreateStationPageComponent
	},
	{
		path: 'setup-station',
		component: Pages.SetupStationPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class InstallRoutingModule { }
