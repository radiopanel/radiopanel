import FtpClient, { IListingElement } from 'ftp-ts';
import * as mimeTypes from 'mime-types';

import { StorageService, StorageItem } from '~shared/types';

export default class FtpStorage implements StorageService {
	private config: any;
	private client: FtpClient;

	constructor(config: any) {
		this.config = config;
		this.client = new FtpClient();
	}

	public async init(): Promise<void> {
		await this.client.connect(this.config);
	}

	public async get(path: string): Promise<NodeJS.ReadableStream> {
		return await this.client.get(path);
	}

	public async list(path: string): Promise<StorageItem[]> {
		return this.mapStorageItems(await this.client.list(path) as IListingElement[]);
	}

	public async put(path: string, input: NodeJS.ReadableStream | Buffer): Promise<void> {
		return this.client.put(input, path);
	}

	public async delete(path: string): Promise<void> {
		return this.client.delete(path);
	}

	public async mkdir(path: string): Promise<void> {
		return this.client.mkdir(path);
	}

	public async rmdir(path: string): Promise<void> {
		return this.client.rmdir(path);
	}

	public async move(oldPath: string, newPath: string): Promise<void> {
		return this.client.rename(oldPath, newPath);
	}

	private mapStorageItems(items: IListingElement[]): StorageItem[] {
		return items.map((item) => ({
			type: item.type === 'd' ? 'directory' : 'file',
			name: item.name,
			size: item.size,
			lastModified: item.date,
			...(item.type !== 'd' && {
				extension: item.name.split('.').pop(),
				mimeType: mimeTypes.lookup(item.name) as string,
			}),
		}));
	}
}
