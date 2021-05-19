import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Banner, BannerState, BannerStore } from './banner.store';

@Injectable()
export class BannerQuery extends QueryEntity<BannerState, Banner> {
	constructor(protected store: BannerStore) {
		super(store);
	}
}
