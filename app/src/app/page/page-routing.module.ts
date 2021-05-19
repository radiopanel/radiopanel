import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';

const routes: Routes = [
	{
		path: 'page-types',
		component: Pages.ListPageComponent
	},
	{
		path: 'page-types/create',
		component: Pages.CreatePageComponent
	},
	{
		path: 'page-types/:id',
		component: Pages.DetailPageComponent
	},
	{
		path: ':pageTypeUuid',
		component: Pages.PageDetailPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PageRoutingModule { }
