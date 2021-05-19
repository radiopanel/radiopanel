import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';

const routes: Routes = [
	{
		path: 'content-types',
		component: Pages.ListPageComponent
	},
	{
		path: 'content-types/create',
		component: Pages.CreatePageComponent
	},
	{
		path: 'content-types/:id',
		component: Pages.DetailPageComponent
	},
	{
		path: ':contentTypeUuid/entries',
		component: Pages.ContentListPageComponent
	},
	{
		path: ':contentTypeUuid/entries/create',
		component: Pages.ContentCreatePageComponent
	},
	{
		path: ':contentTypeUuid/entries/:contentUuid',
		component: Pages.ContentDetailPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ContentRoutingModule { }
