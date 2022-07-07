import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import * as Components from './components';
import { AuthGuard, FeatureGuard } from './guards';
import * as Pages from './pages';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	{
		path: 'auth',
		loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: 'onboarding',
		loadChildren: () => import('../onboarding/onboarding.module').then(m => m.OnboardingModule)
	},
	{
		path: 'tenants',
		loadChildren: () => import('../tenant/tenant.module').then(m => m.TenantModule),
	},
	{
		path: 'install',
		loadChildren: () => import('../install/install.module').then(m => m.InstallModule),
	},
	{
		path: 'resources',
		loadChildren: () => import('../resources/resources.module').then(m => m.ResourcesModule),
	},
	{
		path: '',
		component: Components.WrapperComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'dashboard',
				component: Pages.DashboardPageComponent,
			},
			{
				path: 'users',
				loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
			},
			{
				path: 'requests',
				loadChildren: () => import('../requests/requests.module').then(m => m.RequestsModule),
			},
			{
				path: 'roles',
				loadChildren: () => import('../roles/roles.module').then(m => m.RolesModule),
			},
			{
				path: 'timetable',
				loadChildren: () => import('../timetable/timetable.module').then(m => m.TimetableModule),
			},
			{
				path: 'webhooks',
				loadChildren: () => import('../webhook/webhook.module').then(m => m.WebhookModule),
			},
			{
				path: 'audit-log',
				loadChildren: () => import('../audit-log/audit-log.module').then(m => m.AuditLogModule),
			},
			{
				path: 'api-keys',
				loadChildren: () => import('../api-key/api-key.module').then(m => m.ApiKeyModule),
			},
			{
				path: 'profile',
				loadChildren: () => import('../profile/profile.module').then(m => m.ProfileModule),
			},
			{
				path: 'song-history',
				loadChildren: () => import('../song-history/song-history.module').then(m => m.SongHistoryModule),
			},
			{
				path: 'banners',
				loadChildren: () => import('../banner/banner.module').then(m => m.BannerModule),
			},
			{
				path: 'bans',
				loadChildren: () => import('../ban/ban.module').then(m => m.BanModule),
			},
			{
				path: 'rules',
				loadChildren: () => import('../rule/rule.module').then(m => m.RuleModule),
			},
			{
				path: 'slot-types',
				loadChildren: () => import('../slot-types/slot-types.module').then(m => m.SlotTypesModule),
			},
			{
				path: 'songs',
				loadChildren: () => import('../song/song.module').then(m => m.SongModule),
			},
			{
				path: 'forms',
				loadChildren: () => import('../form/form.module').then(m => m.FormModule),
			},
			{
				path: 'content',
				loadChildren: () => import('../content/content.module').then(m => m.ContentModule),
			},
			{
				path: 'pages',
				loadChildren: () => import('../page/page.module').then(m => m.PageModule),
			},
			{
				path: 'authentication-methods',
				loadChildren: () => import('../authentication-method/authentication-method.module').then(m => m.AuthenticationMethodModule),
			},
		]
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
