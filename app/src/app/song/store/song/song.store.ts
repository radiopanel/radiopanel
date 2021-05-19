import { EntityState, EntityStore, ID, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Song {
	uuid: string;
	name: string;
	url: number;
	image: number;
}

export interface SongState extends EntityState<Song> {
	pagination: {
		currentPage: number;
		totalEntities: number;
		itemsPerPage: number;
	};
}

@Injectable()
@StoreConfig({ name: 'songs', idKey: 'uuid' })
export class SongStore extends EntityStore<SongState, Song> {
  constructor() {
	super();
  }
}
