import { tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getType } from 'mime';

import { ResourceStore } from './resources.store';

@Injectable()
export class ResourceService {

	constructor(
		private resourceStore: ResourceStore,
		private http: HttpClient
	) { }

	upload(dir: string, file: File) {
		this.resourceStore.setLoading(true);

		const formData = new FormData();
		formData.append('file', file);

		return this.http.post<any>('/api/v1/storage', formData, {
			params: {
				dir
			}
		})
			.pipe(
				tap(() => {
					this.resourceStore.add({
						name: file.name,
						lastModified: new Date(),
						type: 'file',
						size: file.size,
						extension: file.name.split('.').pop(),
						mimeType: getType(file.name)
					});
					this.resourceStore.setLoading(false);
				})
			);
	}

	remove(filePath: string) {
		this.resourceStore.setLoading(true);
		return this.http.delete<any>('/api/v1/storage', {
			params: {
				dir: filePath
			}
		})
			.pipe(
				tap(() => {
					this.resourceStore.remove(filePath.split('/').pop());
					this.resourceStore.setLoading(false);
				})
			);
	}

	fetch(dir: string = '') {
		this.resourceStore.setLoading(true);
		return this.http.get<any>('/api/v1/storage/directory', {
			params: {
				dir,
			}
		})
			.pipe(
				tap(result => {
					this.resourceStore.set(result);
					this.resourceStore.setLoading(false);
				})
			);
	}

	createDirectory(dir: string) {
		this.resourceStore.setLoading(true);
		return this.http.post<any>('/api/v1/storage/directory', null, {
			params: {
				dir,
			}
		})
			.pipe(
				tap(() => {
					this.resourceStore.upsert(dir.split('/').pop(), {
						name: dir.split('/').pop(),
						lastModified: new Date(),
						type: 'directory'
					});
					this.resourceStore.setLoading(false);
				})
			);
	}

	removeDirectory(dir: string) {
		this.resourceStore.setLoading(true);
		return this.http.delete<any>('/api/v1/storage/directory', {
			params: {
				dir,
			}
		})
			.pipe(
				tap(() => {
					this.resourceStore.remove(dir.split('/').pop());
					this.resourceStore.setLoading(false);
				})
			);
	}

	move(oldPath: string, newPath: string) {
		this.resourceStore.setLoading(true);
		return this.http.post<any>('/api/v1/storage/move', {
			oldPath, newPath
		})
			.pipe(
				tap(() => {
					// this.resourceStore.remove(dir.split('/').pop());
					this.resourceStore.setLoading(false);
				})
			);
	}
}
