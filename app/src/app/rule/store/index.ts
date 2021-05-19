import { RulePageQuery } from './rule-page/rule-page.query';
import { RulePageService } from './rule-page/rule-page.service';
import { RulePageStore } from './rule-page/rule-page.store';

export { RulePageQuery } from './rule-page/rule-page.query';
export { RulePageService } from './rule-page/rule-page.service';
export { RulePageStore } from './rule-page/rule-page.store';

export const StoreServices = [
	RulePageService,
];

export const Stores = [
	RulePageStore,
];

export const Queries = [
	RulePageQuery,
];

