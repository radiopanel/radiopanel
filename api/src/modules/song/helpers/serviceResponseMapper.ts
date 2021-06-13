import * as uuid from 'uuid';
import md5 from 'md5'
import { propOr, pathOr, path, prop, pick } from 'ramda';

import { Song } from "~entities";

// TODO: clean this up
export const serviceResponseMapper = (originalTitle: string, service: "deezer" | "spotify", response: any): Partial<Song> => {
	if (service === "spotify") {
		const track = pathOr(null, ['tracks', 'items', 0])(response);

		return {
			uuid: uuid.v4(),
			externalId: md5(originalTitle),
			title: propOr(path([1])(originalTitle.split('-')) || "", 'name')(track),
			artist: pathOr(path<string>([0])(originalTitle.split('-')), ['artists', 0, 'name'])(track),
			album: pathOr('Unknown Album', ['album', 'name'])(track),
			graphic: {
				large: pathOr(null, ['album', 'images', 0, 'url'])(track),
				medium: pathOr(null, ['album', 'images', 1, 'url'])(track),
				small: pathOr(null, ['album', 'images', 2, 'url'])(track),
			},
			previewUrl: pathOr(null, ['preview_url'])(track),
			releaseDate: pathOr(new Date(), ['album', 'release_date'])(track),
			durationMs: pathOr(1000, ['duration_ms'])(track),
			originalTitle,
			extraInfo: {
				album: pick(['album_type', 'external_urls', 'href', 'id', 'release_date', 'release_date_precision', 'total_tracks', 'uri'])(propOr({}, 'album')(track)),
				artist: pick(['id', 'name', 'uri', 'href'])(pathOr({}, ['artists', 0])(track)),
				track: pick(['href', 'external_urls', 'uri', 'explicit', 'id'])(track || {})
			},
			updatedAt: new Date(),
			createdAt: new Date()
		};
	}

	if (service === "deezer") {
		const track = pathOr(null, ['data', 0])(response);

		return {
			uuid: uuid.v4(),
			externalId: md5(originalTitle),
			title: propOr(path([1])(originalTitle.split('-')) || "", 'title')(track),
			artist: pathOr(path<string>([0])(originalTitle.split('-')), ['artist', 'name'])(track),
			album: pathOr('Unknown Album', ['album', 'title'])(track),
			graphic: {
				large: pathOr(null, ['album', 'cover_xl'])(track),
				medium: pathOr(null, ['album', 'cover_big'])(track),
				small: pathOr(null, ['album', 'cover_medium'])(track),
			},
			previewUrl: pathOr(null, ['preview'])(track),
			releaseDate: new Date(),
			durationMs: pathOr(1000, ['duration'])(track),
			originalTitle,
			extraInfo: {},
			updatedAt: new Date(),
			createdAt: new Date()
		};
	}

	if (service === "apple-music") {
		const track = pathOr(null, ['results', 0])(response);

		return {
			uuid: uuid.v4(),
			externalId: md5(originalTitle),
			title: propOr(path([1])(originalTitle.split('-')) || "", 'trackName')(track),
			artist: pathOr(path<string>([0])(originalTitle.split('-')), ['artistName'])(track),
			album: pathOr('Unknown Album', ['collectionName'])(track),
			graphic: {
				large: pathOr(null, ['artworkUrl100'])(track)?.replace('100x100bb', '640x640bb'),
				medium: pathOr(null, ['artworkUrl60'])(track)?.replace('60x60bb', '300x300bb'),
				small: pathOr(null, ['artworkUrl30'])(track)?.replace('30x30bb', '64x64bb'),
			},
			extraInfo: {
				albumUrl: pathOr(null, ['collectionViewUrl'])(track),
				trackUrl: pathOr(null, ['trackViewUrl'])(track),
				artistUrl: pathOr(null, ['artistViewUrl'])(track),
				primaryGenreName: pathOr(null, ['primaryGenreName'])(track),
				albumPrice: pathOr(null, ['collectionPrice'])(track),
				trackPrice: pathOr(null, ['trackPrice'])(track),
				currency: pathOr(null, ['currency'])(track),
				country: pathOr(null, ['country'])(track),
			},
			previewUrl: pathOr(null, ['previewUrl'])(track),
			releaseDate: pathOr(null, ['releaseDate'])(track),
			durationMs: pathOr(1000, ['trackTimeMillis'])(track),
			originalTitle,
			updatedAt: new Date(),
			createdAt: new Date()
		};
	}
}

export const manualSearchMapper = (service: "deezer" | "spotify", response: any): Partial<Song>[] => {
	if (service === "spotify") {
		const tracks = pathOr<any[]>(null, ['tracks', 'items'])(response);

		return tracks.map(track => ({
			title: prop('name')(track),
			artist: path<string>(['artists', 0, 'name'])(track),
			album: pathOr('Unknown Album', ['album', 'name'])(track),
			graphic: {
				large: pathOr(null, ['album', 'images', 0, 'url'])(track),
				medium: pathOr(null, ['album', 'images', 1, 'url'])(track),
				small: pathOr(null, ['album', 'images', 2, 'url'])(track),
			},
			extraInfo: {
				album: pick(['album_type', 'external_urls', 'href', 'id', 'release_date', 'release_date_precision', 'total_tracks', 'uri'])(propOr({}, 'album')(track)),
				artist: pick(['id', 'name', 'uri', 'href'])(pathOr({}, ['artists', 0])(track)),
				track: pick(['href', 'external_urls', 'uri', 'explicit', 'id'])(track)
			},
			previewUrl: pathOr(null, ['preview_url'])(track),
			releaseDate: pathOr(new Date(), ['album', 'release_date'])(track),
			durationMs: pathOr(1000, ['duration_ms'])(track),
		}));
	}

	if (service === "deezer") {
		const tracks = pathOr<any[]>(null, ['data'])(response);

		return tracks.map(track => ({
			title: prop('title')(track),
			artist: path<string>(['artist', 'name'])(track),
			album: pathOr('Unknown Album', ['album', 'title'])(track),
			graphic: {
				large: pathOr(null, ['album', 'cover_xl'])(track),
				medium: pathOr(null, ['album', 'cover_big'])(track),
				small: pathOr(null, ['album', 'cover_medium'])(track),
			},
			previewUrl: pathOr(null, ['preview'])(track),
			releaseDate: new Date(),
			durationMs: pathOr(1000, ['duration'])(track),
		}));
	}

	if (service === "apple-music") {
		const tracks = pathOr<any[]>(null, ['results'])(response);

		return tracks.map(track => ({
			title: prop('trackName')(track),
			artist: path<string>(['artistName'])(track),
			album: pathOr('Unknown Album', ['collectionName'])(track),
			graphic: {
				large: pathOr(null, ['artworkUrl100'])(track)?.replace('100x100bb', '640x640bb'),
				medium: pathOr(null, ['artworkUrl60'])(track)?.replace('60x60bb', '300x300bb'),
				small: pathOr(null, ['artworkUrl30'])(track)?.replace('30x30bb', '64x64bb'),
			},
			extraInfo: {
				albumUrl: pathOr(null, ['collectionViewUrl'])(track),
				trackUrl: pathOr(null, ['trackViewUrl'])(track),
				artistUrl: pathOr(null, ['artistViewUrl'])(track),
				primaryGenreName: pathOr(null, ['primaryGenreName'])(track),
				albumPrice: pathOr(null, ['collectionPrice'])(track),
				trackPrice: pathOr(null, ['trackPrice'])(track),
				currency: pathOr(null, ['currency'])(track),
				country: pathOr(null, ['country'])(track),
			},
			previewUrl: pathOr(null, ['previewUrl'])(track),
			releaseDate: pathOr(null, ['releaseDate'])(track),
			durationMs: pathOr(1000, ['trackTimeMillis'])(track),
		}));
	}
}
