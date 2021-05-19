import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface SongHistory {
	uuid: string;
	title: string;
	artist: string;
	graphic: any;
	updatedAt: Date;
	createdAt: Date;
}

export interface SongHistoryState extends EntityState<SongHistory> {
	pagination: {
		currentPage: number;
		totalEntities: number;
		itemsPerPage: number;
	};
}

@Injectable()
@StoreConfig({ name: 'songHistory', idKey: 'uuid' })
export class SongHistoryStore extends EntityStore<SongHistoryState, SongHistory> {
  constructor() {
	super();
  }
}
