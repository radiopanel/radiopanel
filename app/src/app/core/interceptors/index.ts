import { TokenInterceptor } from './token.interceptor';
import { HttpErrorInterceptor } from './error.interceptor';

export { TokenInterceptor } from './token.interceptor';
export { HttpErrorInterceptor } from './error.interceptor';

export const Interceptors = [
	TokenInterceptor,
	HttpErrorInterceptor
];
