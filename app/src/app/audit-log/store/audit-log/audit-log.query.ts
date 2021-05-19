import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { AuditLog, AuditLogState, AuditLogStore } from './audit-log.store';

@Injectable()
export class AuditLogQuery extends QueryEntity<AuditLogState, AuditLog> {
	constructor(protected store: AuditLogStore) {
		super(store);
	}

	public pagination$ = this.select('pagination');
}
