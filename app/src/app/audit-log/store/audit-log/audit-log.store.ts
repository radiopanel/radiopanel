import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface AuditLog {
	uuid: string;
	action: string;
	actionContext: any;
	actionData: any;
	updatedAt: Date;
	createdAt: Date;
}

export interface AuditLogState extends EntityState<AuditLog> {
	pagination: {
		currentPage: number;
		totalEntities: number;
		itemsPerPage: number;
	};
}

@Injectable()
@StoreConfig({ name: 'auditLog', idKey: 'uuid' })
export class AuditLogStore extends EntityStore<AuditLogState, AuditLog> {
  constructor() {
	super();
  }
}
