
import fs from 'fs/promises'
import { createReadStream } from 'fs';
import { join } from 'path';

import * as mimeTypes from 'mime-types';

import { StorageService, StorageItem } from '~shared/types';


export default class FsStorage implements StorageService {
	public async init(): Promise<void> {
		return;
	}

	public async get(path: string): Promise<NodeJS.ReadableStream> {
		return createReadStream(join(__dirname, '../../../../../', 'uploads', path));
	}

	public async list(path: string): Promise<StorageItem[]> {
		return this.mapStorageItems(join(__dirname, '../../../../../', 'uploads', path), await fs.readdir(join(__dirname, '../../../../../', 'uploads', path)));
	}

	public async put(path: string, input: NodeJS.ReadableStream | Buffer): Promise<void> {
		return fs.writeFile(join(__dirname, '../../../../../', 'uploads', path), input);
	}

	public async delete(path: string): Promise<void> {
		return fs.unlink(join(__dirname, '../../../../../', 'uploads', path));
	}

	public async mkdir(path: string): Promise<void> {
		return fs.mkdir(join(__dirname, '../../../../../', 'uploads', path));
	}

	public async rmdir(path: string): Promise<void> {
		return fs.rmdir(join(__dirname, '../../../../../', 'uploads', path))
	}

	private async mapStorageItems(dir: string, items: string[]): Promise<StorageItem[]> {
		return Promise.all(items.map(async (item) => {
			const stat = await fs.stat(`${dir}/${item}`);

			return {
				type: stat.isFile ? 'file' : 'directory',
				name: item,
				size: stat.size,
				lastModified: stat.mtime,
				...(stat.isFile && {
					extension: item.split('.').pop(),
					mimeType: mimeTypes.lookup(item) as string,
				}),
			};
		}));
	}
}
