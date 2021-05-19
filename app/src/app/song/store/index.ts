import { SongQuery } from './song/song.query';
import { SongService } from './song/song.service';
import { SongStore } from './song/song.store';

export { SongQuery } from './song/song.query';
export { SongService } from './song/song.service';
export { SongStore } from './song/song.store';

export const StoreServices = [
	SongService,
];

export const Stores = [
	SongStore,
];

export const Queries = [
	SongQuery,
];

