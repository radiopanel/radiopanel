import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { Category, CategoryState, CategoryStore } from './categories.store';

@Injectable()
export class CategoryQuery extends QueryEntity<CategoryState, Category> {
	constructor(protected store: CategoryStore) {
		super(store);
	}
}
