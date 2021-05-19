import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';

const routes: Routes = [
	{
		path: 'pages',
		component: Pages.ListPageComponent
	},
	{
		path: 'pages/create',
		component: Pages.CreatePageComponent
	},
	{
		path: 'pages/:id',
		component: Pages.DetailPageComponent
	},
	{
		path: 'view',
		component: Pages.ViewPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RuleRoutingModule { }
