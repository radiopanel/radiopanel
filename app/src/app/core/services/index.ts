import { AuthService } from './auth.service';
import { SocketService } from './socket.service';
import { DashboardComponentRegistry } from './component-registry.service';

export { AuthService } from './auth.service';
export { SocketService } from './socket.service';
export { DashboardComponentRegistry } from './component-registry.service';

export const Services = [
	AuthService,
	SocketService,
	DashboardComponentRegistry
];
