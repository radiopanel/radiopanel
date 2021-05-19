import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { SongHistory, SongHistoryState, SongHistoryStore } from './song-history.store';

@Injectable()
export class SongHistoryQuery extends QueryEntity<SongHistoryState, SongHistory> {
	constructor(protected store: SongHistoryStore) {
		super(store);
	}

	public pagination$ = this.select('pagination');
}
