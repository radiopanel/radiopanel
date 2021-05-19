import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { AuditLogStore } from './audit-log.store';

@Injectable()
export class AuditLogService {

	constructor(
		private auditLogStore: AuditLogStore,
		private http: HttpClient,
	) { }

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.auditLogStore.setLoading(true);
		return this.http.get<any>(`/api/v1/audit-log`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.auditLogStore.set(result._embedded);
					this.auditLogStore.update({
						pagination: result._page,
					});
					this.auditLogStore.setLoading(false);
				})
			);
	}

	fetchOne(auditLogUuid: string) {
		this.auditLogStore.setLoading(true);
		return this.http.get<any>(`/api/v1/audit-log/${auditLogUuid}`)
			.pipe(
				tap(result => {
					this.auditLogStore.set([result as any]);
					this.auditLogStore.setLoading(false);
				})
			);
	}

}






