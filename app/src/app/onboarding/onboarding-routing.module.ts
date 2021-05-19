import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';
import { AuthGuard } from '../core/guards';

const routes: Routes = [
	{
		path: 'register/:inviteUuid',
		component: Pages.RegisterPageComponent
	},
	{
		path: 'tenant-invite/:inviteUuid',
		component: Pages.TenantInvitePageComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class OnboardingRoutingModule { }
