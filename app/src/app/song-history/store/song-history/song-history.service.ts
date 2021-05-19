import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { SongHistoryStore } from './song-history.store';

@Injectable()
export class SongHistoryService {

	constructor(
		private requestStore: SongHistoryStore,
		private http: HttpClient,
	) { }

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.requestStore.setLoading(true);
		return this.http.get<any>(`/api/v1/song-history`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.requestStore.set(result._embedded);
					this.requestStore.update({
						pagination: result._page,
					});
					this.requestStore.setLoading(false);
				})
			);
	}

}






