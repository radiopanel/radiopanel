import { AuthGuard } from './auth.guard';
import { RulesGuard } from './rules.guard';
import { FeatureGuard } from './feature.guard';

export { AuthGuard } from './auth.guard';
export { RulesGuard } from './rules.guard';
export { FeatureGuard } from './feature.guard';

export const Guards = [
	AuthGuard,
	RulesGuard,
	FeatureGuard
];
