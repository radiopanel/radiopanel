import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface ApiKey {
	name: string;
	permissions: string[];
	updatedAt: Date;
	usage: any[];
	createdAt: Date;
}

export interface ApiKeyState extends EntityState<ApiKey> { }

@Injectable()
@StoreConfig({ name: 'apiKeys', idKey: 'uuid' })
export class ApiKeyStore extends EntityStore<ApiKeyState, ApiKey> {
  constructor() {
	super();
  }
}
