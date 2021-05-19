import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface Category {
	uuid: string;
	name: string;
	updatedAt: Date;
	createdAt: Date;
}

export interface CategoryState extends EntityState<Category> { }

@Injectable()
@StoreConfig({ name: 'categories', idKey: 'uuid' })
export class CategoryStore extends EntityStore<CategoryState, Category> {
  constructor() {
	super();
  }
}
