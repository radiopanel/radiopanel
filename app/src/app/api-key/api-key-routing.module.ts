import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';

const routes: Routes = [
	{
		path: '',
		component: Pages.ListPageComponent
	},
	{
		path: 'create',
		component: Pages.CreatePageComponent
	},
	{
		path: ':id',
		component: Pages.DetailPageComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ApiKeyRoutingModule { }
