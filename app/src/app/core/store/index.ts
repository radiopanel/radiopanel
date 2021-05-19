import { DashboardQuery } from './dashboard/dashboard.query';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardStore } from './dashboard/dashboard.store';
import { RuleQuery } from './rules/rule.query';
import { RuleService } from './rules/rule.service';
import { RuleStore } from './rules/rule.store';

export { DashboardService } from './dashboard/dashboard.service';
export { DashboardStore } from './dashboard/dashboard.store';
export { DashboardQuery } from './dashboard/dashboard.query';
export { RuleQuery } from './rules/rule.query';
export { RuleService } from './rules/rule.service';
export { RuleStore } from './rules/rule.store';

export const StoreServices = [
	DashboardService,
	RuleService
];

export const Stores = [
	DashboardStore,
	RuleStore
];

export const Queries = [
	DashboardQuery,
	RuleQuery
];

