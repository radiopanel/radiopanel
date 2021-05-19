import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PermissionStore } from './permissions.store';

@Injectable()
export class PermissionService {

	constructor(
		private permissionStore: PermissionStore,
		private http: HttpClient
	) { }

	fetch(): Observable<any[]> {
		this.permissionStore.setLoading(true);
		return this.http.get<any>('/api/v1/permissions')
			.pipe(
				tap(fields => {
					this.permissionStore.update({
						result: fields
					});
					this.permissionStore.setLoading(false);
				})
			);
  }
}
