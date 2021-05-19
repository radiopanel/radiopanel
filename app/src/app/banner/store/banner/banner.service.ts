import { pathOr } from 'ramda';
import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from '../../../core/services';
import { BannerStore } from './banner.store';

@Injectable()
export class BannerService {

	constructor(
		private bannerStore: BannerStore,
		private http: HttpClient,
	) { }

	create(values: any) {
		this.bannerStore.setLoading(true);
		return this.http.post<any>(`/api/v1/banners`, values)
			.pipe(
				tap(result => {
					this.bannerStore.add(result as any);
					this.bannerStore.setLoading(false);
				})
			);
	}

	fetch({ page, pagesize }: { page?: any, pagesize?: any } = {}) {
		this.bannerStore.setLoading(true);
		return this.http.get<any>(`/api/v1/banners`, {
			params: {
				page: page || 1,
				pagesize: pagesize || 20
			}
		})
			.pipe(
				tap(result => {
					this.bannerStore.set(result._embedded);
					this.bannerStore.update({
						pagination: result._page,
					});
					this.bannerStore.setLoading(false);
				})
			);
	}

	fetchOne(bannerId: string) {
		this.bannerStore.setLoading(true);
		return this.http.get<any>(
			`/api/v1/banners/${bannerId}`)
			.pipe(
				tap(result => {
					this.bannerStore.set([result as any]);
					this.bannerStore.setLoading(false);
				})
			);
	}

	update(bannerId: string, values: any) {
		this.bannerStore.setLoading(true);
		return this.http.put<any>(
			`/api/v1/banners/${bannerId}`,
			values
		)
			.pipe(
				tap(() => {
					this.bannerStore.upsert(bannerId, values);
					this.bannerStore.setLoading(false);
				})
			);
	}

	delete(bannerId: string) {
		this.bannerStore.setLoading(true);
		return this.http.delete<any>(`/api/v1/banners/${bannerId}`)
			.pipe(
				tap(result => {
					this.bannerStore.remove(bannerId);
					this.bannerStore.setLoading(false);
				})
			);
	}
}






