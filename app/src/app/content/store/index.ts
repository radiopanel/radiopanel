import { ContentTypeQuery } from './content-type/content-type.query';
import { ContentTypeService } from './content-type/content-type.service';
import { ContentTypeStore } from './content-type/content-type.store';
import { ContentService } from './content/content.service';
import { ContentStore } from './content/content.store';
import { ContentQuery } from './content/content.query';

export { ContentTypeQuery } from './content-type/content-type.query';
export { ContentTypeService } from './content-type/content-type.service';
export { ContentTypeStore } from './content-type/content-type.store';
export { ContentService } from './content/content.service';
export { ContentStore } from './content/content.store';
export { ContentQuery } from './content/content.query';

export const StoreServices = [
	ContentTypeService,
	ContentService,
];

export const Stores = [
	ContentTypeStore,
	ContentStore,
];

export const Queries = [
	ContentTypeQuery,
	ContentQuery
];
