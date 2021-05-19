import { CoreComponent } from './core/core.component';
import { MenuComponent } from './menu/menu.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToastComponent } from './toast/toast.component';
import { WrapperComponent } from './wrapper/wrapper.component';
import { DashboardItemComponent } from './dashboard/dashboard-item.component';

import { DashboardComponents } from './dashboard/items';

export { CoreComponent } from './core/core.component';
export { MenuComponent } from './menu/menu.component';
export { SidebarComponent } from './sidebar/sidebar.component';
export { ToastComponent } from './toast/toast.component';
export { WrapperComponent } from './wrapper/wrapper.component';
export { DashboardItemComponent } from './dashboard/dashboard-item.component';

export const Components = [
	CoreComponent,
	MenuComponent,
	SidebarComponent,
	ToastComponent,
	WrapperComponent,
	DashboardItemComponent,
	...DashboardComponents,
];

export const EntryComponents = [
	ToastComponent,
	...DashboardComponents,
];
