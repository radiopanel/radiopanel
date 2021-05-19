import { PageTypeQuery } from './page-type/page-type.query';
import { PageTypeService } from './page-type/page-type.service';
import { PageTypeStore } from './page-type/page-type.store';
import { PageTypeFieldQuery } from './page-type-field/page-type-field.query';
import { PageTypeFieldService } from './page-type-field/page-type-field.service';
import { PageTypeFieldStore } from './page-type-field/page-type-field.store';
import { PageService } from './page/page.service';
import { PageStore } from './page/page.store';
import { PageQuery } from './page/page.query';

export { PageTypeQuery } from './page-type/page-type.query';
export { PageTypeService } from './page-type/page-type.service';
export { PageTypeStore } from './page-type/page-type.store';
export { PageTypeFieldQuery } from './page-type-field/page-type-field.query';
export { PageTypeFieldService } from './page-type-field/page-type-field.service';
export { PageTypeFieldStore } from './page-type-field/page-type-field.store';
export { PageService } from './page/page.service';
export { PageStore } from './page/page.store';
export { PageQuery } from './page/page.query';

export const StoreServices = [
	PageTypeService,
	PageTypeFieldService,
	PageService,
];

export const Stores = [
	PageTypeStore,
	PageTypeFieldStore,
	PageStore,
];

export const Queries = [
	PageTypeQuery,
	PageTypeFieldQuery,
	PageQuery
];
