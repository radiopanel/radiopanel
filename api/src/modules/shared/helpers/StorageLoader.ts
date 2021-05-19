import { Injectable } from '@nestjs/common';

import { StorageServiceFactory } from '~shared/types'

type StorageType = 'ftp' | 's3bucket';

@Injectable()
export class StorageLoader {
	public load(storageType: StorageType): StorageServiceFactory {
		return require(`../storage/${storageType}`).default;
	}
}
