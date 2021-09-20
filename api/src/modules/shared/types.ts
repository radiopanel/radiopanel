import { Type } from '@nestjs/common';

class Pagination {
	totalEntities: number;
	itemsPerPage?: number;
	currentPage?: number;
}

export class Paginated<T> {
	_aggregation?: any;
	_page: Pagination;
	_embedded: T[];
}

export function Paginate<T>(classRef: Type<T>): Type<Paginated<T>> {
	return classRef as any;
}

export interface StorageItem {
	type: string;
	name: string;
	size: number;
	lastModified: Date;
	extension?: string;
	mimeType?: string;
}

export interface StorageService {
	init(): Promise<void>;
	get(path: string): Promise<NodeJS.ReadableStream>;
	list(path: string): Promise<StorageItem[]>;
	put(path: string, input: Buffer | NodeJS.ReadableStream): Promise<void>;
	delete(path: string): Promise<void>;
	mkdir(path: string): Promise<void>;
	rmdir(path: string): Promise<void>;
	move(oldPath: string, newPath: string): Promise<void>;
}

export type StorageServiceFactory = new (config: any) => StorageService;
