import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Song, SongState, SongStore } from './song.store';

@Injectable()
export class SongQuery extends QueryEntity<SongState, Song> {
	constructor(protected store: SongStore) {
		super(store);
	}

	public pagination$ = this.select('pagination');
}
