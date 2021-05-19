import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { SongStore } from './song.store';

@Injectable()
export class SongService {

	constructor(
		private songStore: SongStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		this.songStore.setLoading(true);
		return this.http.post<any>(`/api/v1/songs`, values)
			.pipe(
				tap(result => {
					this.songStore.add(result as any);
					this.songStore.setLoading(false);
				})
			);
	}

	fetch(search: string, { page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.songStore.setLoading(true);
		return this.http.get<any>(`/api/v1/songs`, {
			params: {
				search: search || '',
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.songStore.set(result._embedded);
					this.songStore.update({
						pagination: result._page,
					});
					this.songStore.setLoading(false);
				})
			);
	}

	fetchOne(songId: string) {
		this.songStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/songs/${songId}`)
			.pipe(
				tap(result => {
					this.songStore.set([result as any]);
					this.songStore.setLoading(false);
				})
			);
	}

	update(songId: string, values: any) {
		this.songStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/songs/${songId}`,
			values
		)
			.pipe(
				tap(() => {
					this.songStore.upsert(songId, values);
					this.songStore.setLoading(false);
				})
			);
	}

	delete(songId: string) {
		this.songStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/songs/${songId}`)
			.pipe(
				tap(result => {
					this.songStore.remove(songId);
					this.songStore.setLoading(false);
				})
			);
	}
}






