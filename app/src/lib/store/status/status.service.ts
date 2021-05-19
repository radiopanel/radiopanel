import { StatusStore } from './status.store';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StatusService {
	constructor(
		private statusStore: StatusStore,
		private http: HttpClient,
	) {}

	fetch() {
		this.statusStore.setLoading(true);
		return this.http.get<any>('/api/v1/status')
			.pipe(
				tap(result => {
					this.statusStore.update(result);
					this.statusStore.setLoading(false);
				})
			);
	}
}
