import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PasswordResetStore } from './password-reset.store';

@Injectable()
export class PasswordResetService {

	constructor(
		private passwordResetStore: PasswordResetStore,
		private http: HttpClient,
	) { }

	findOne(passwordResetUuid: string) {
		this.passwordResetStore.setLoading(true);
		return this.http.get<any>(`/api/v1/auth/password-reset/${passwordResetUuid}`)
			.pipe(
				tap(result => {
					this.passwordResetStore.add(result as any);
					this.passwordResetStore.setLoading(false);
				})
			);
	}

	reset(passwordResetUuid: string, newPasswordData: any) {
		return this.http.put<any>(`/api/v1/auth/password-reset/${passwordResetUuid}`, newPasswordData);
	}
}






