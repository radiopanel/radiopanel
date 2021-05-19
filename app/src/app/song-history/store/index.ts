import { SongHistoryQuery } from './song-history/song-history.query';
import { SongHistoryService } from './song-history/song-history.service';
import { SongHistoryStore } from './song-history/song-history.store';

export { SongHistoryQuery } from './song-history/song-history.query';
export { SongHistoryService } from './song-history/song-history.service';
export { SongHistoryStore } from './song-history/song-history.store';

export const StoreServices = [
	SongHistoryService,
];

export const Stores = [
	SongHistoryStore,
];

export const Queries = [
	SongHistoryQuery,
];

