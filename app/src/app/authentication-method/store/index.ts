import { AuthenticationMethodQuery } from './authentication-method/authentication-method.query';
import { AuthenticationMethodService } from './authentication-method/authentication-method.service';
import { AuthenticationMethodStore } from './authentication-method/authentication-method.store';

export { AuthenticationMethodQuery } from './authentication-method/authentication-method.query';
export { AuthenticationMethodService } from './authentication-method/authentication-method.service';
export { AuthenticationMethodStore } from './authentication-method/authentication-method.store';

export const StoreServices = [
	AuthenticationMethodService,
];

export const Stores = [
	AuthenticationMethodStore,
];

export const Queries = [
	AuthenticationMethodQuery,
];

