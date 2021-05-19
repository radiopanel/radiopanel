import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Banner {
	uuid: string;
	name: string;
	url: number;
	image: number;
}

export interface BannerState extends EntityState<Banner> { }

@Injectable()
@StoreConfig({ name: 'banners', idKey: 'uuid' })
export class BannerStore extends EntityStore<BannerState, Banner> {
  constructor() {
	super();
  }
}
