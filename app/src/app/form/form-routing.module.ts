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
	},
	{
		path: ':formUuid/entries',
		component: Pages.EntryListPageComponent
	},
	{
		path: ':formUuid/entries/create',
		component: Pages.EntryCreatePageComponent
	},
	{
		path: ':formUuid/entries/:entryUuid',
		component: Pages.EntryDetailPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class FormRoutingModule { }
