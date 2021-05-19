import { map, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DynamicInputService {

	constructor(
		private http: HttpClient
	) { }

	fetchContent(contentTypeId: string, filters?: any) {
		return this.http.get<any>(`/api/v1/content/${contentTypeId}`, {
			params: {
				...filters,
				'sort[name]': 'ASC'
			}
		})
			.pipe(
				map((content) => content._embedded)
			);
	}

	fetchCategories(filters?: any) {
		return this.http.get<any>(`/api/v1/categories`, {
			params: {
				...filters,
			}
		})
			.pipe(
				map((content) => content._embedded)
			);
	}

	fetchContentType(filters?: any) {
		return this.http.get<any>(`/api/v1/content-types`, {
			params: filters
		})
			.pipe(
				map((content) => content._embedded)
			);
	}

	fetchRoles(filters?: any) {
		return this.http.get<any>(`/api/v1/roles`, {
			params: filters
		})
			.pipe(
				map((content) => content._embedded)
			);
	}

	fetchData(endpoint: string, filters?: any) {
		return this.http.get<any>(`/api/v1/${endpoint}`, {
			params: filters
		})
			.pipe(
				map((content) => content._embedded)
			);
	}

	fetchTenants(filters?: any) {
		return this.http.get<any>(`/api/v1/tenants`, {
			params: filters
		})
			.pipe(
				map((content) => content._embedded as any[])
			);
	}

	fetchTaxonomy(filters?: any) {
		return this.http.get<any>(`/api/v1/taxonomy`, {
			params: filters
		})
			.pipe(
				map((content) => content._embedded as any[])
			);
	}

	fetchTaxonomyValues(taxonomyUuid: string, filters?: any) {
		return this.http.get<any>(`/api/taxonomy/${taxonomyUuid}`, {
			params: filters
		})
			.pipe(
				map((content) => content.items as any[])
			);
	}
}
