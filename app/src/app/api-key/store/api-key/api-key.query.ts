import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { ApiKey, ApiKeyState, ApiKeyStore } from './api-key.store';

@Injectable()
export class ApiKeyQuery extends QueryEntity<ApiKeyState, ApiKey> {
	constructor(protected store: ApiKeyStore) {
		super(store);
	}
}
