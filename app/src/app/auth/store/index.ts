import { PasswordResetQuery } from './password-reset/password-reset.query';
import { PasswordResetService } from './password-reset/password-reset.service';
import { PasswordResetStore } from './password-reset/password-reset.store';

export { PasswordResetQuery } from './password-reset/password-reset.query';
export { PasswordResetService } from './password-reset/password-reset.service';
export { PasswordResetStore } from './password-reset/password-reset.store';

export const StoreServices = [
	PasswordResetService
];

export const Stores = [
	PasswordResetStore
];

export const Queries = [
	PasswordResetQuery
];

