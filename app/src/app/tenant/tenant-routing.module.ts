import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';
import { WrapperComponent } from '../core/components';

const routes: Routes = [
	{

		path: '',
		component: WrapperComponent,
		children: [
			{
				path: '',
				redirectTo: 'general'
			},
			{
				path: 'settings',
				component: Pages.SettingsPageComponent,
			},
			{
				path: 'settings/stream',
				component: Pages.StreamPageComponent,
			},
			{
				path: 'settings/general',
				component: Pages.GeneralPageComponent,
			},
			{
				path: 'settings/timetable',
				component: Pages.TimetablePageComponent,
			},
			{
				path: 'settings/requests',
				component: Pages.RequestsPageComponent,
			},
			{
				path: 'settings/patreon',
				component: Pages.PatreonPageComponent,
			},
			{
				path: 'settings/dashboard',
				component: Pages.DashboardPageComponent,
			},
			{
				path: 'settings/matching-service',
				component: Pages.MatchingServicePageComponent,
			},
			{
				path: 'settings/email',
				component: Pages.EmailPageComponent,
			},
			{
				path: 'socials',
				component: Pages.SocialsPageComponent
			},
			{
				path: 'profile-fields',
				component: Pages.ProfileFieldsPageComponent
			},
			{
				path: 'slot-fields',
				component: Pages.SlotFieldsPageComponent
			},
			{
				path: 'customisation',
				component: Pages.CustomisationPageComponent
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TenantRoutingModule { }
