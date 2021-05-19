import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ProfileStore } from './profile.store';

@Injectable()
export class ProfileService {

	constructor(
		private profileStore: ProfileStore,
		private http: HttpClient,
	) { }

	fetchOne() {
		this.profileStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/profile`)
			.pipe(
				tap(result => {
					this.profileStore.update(result);
					this.profileStore.setLoading(false);
				})
			);
	}

	update(values: any) {
		this.profileStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/profile`,
			values
		)
			.pipe(
				tap(() => {
					this.profileStore.update(values);
					this.profileStore.setLoading(false);
				})
			);
	}
}






