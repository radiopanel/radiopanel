import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Pages from './pages';

const routes: Routes = [
	{
		path: 'login',
		component: Pages.LoginPageComponent
	},
	{
		path: 'reset-password',
		component: Pages.RequestPasswordResetPageComponent
	},
	{
		path: 'reset-password/:passwordResetUuid',
		component: Pages.PasswordResetPageComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthRoutingModule { }
