import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Ban, BanState, BanStore } from './ban.store';

@Injectable()
export class BanQuery extends QueryEntity<BanState, Ban> {
	constructor(protected store: BanStore) {
		super(store);
	}
}
