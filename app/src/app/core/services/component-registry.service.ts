import { Inject, Injectable, Type } from '@angular/core';
import { Subject } from 'rxjs';

import {
	DASHBOARD_COMPONENTS,
	DASHBOARD_COMPONENTS_FALLBACK
} from '../core.conf';

@Injectable({
	providedIn: 'root'
})
export class DashboardComponentRegistry {
	public components$ = new Subject<any>();

	private components: any = [];
	private fallback: Type<any> | any;

	constructor() {
		this.fallback = {
			type: 'fallback',
			component: DASHBOARD_COMPONENTS_FALLBACK,
			title: 'Unknown component'
		};

		this.components$.subscribe((cmpts: any) => (this.components = cmpts));

		this.components$.next(DASHBOARD_COMPONENTS);
	}

	public getComponent<T = any>(type: string): any {
		return (
			this.components.find((component: any) => component.type === type) ||
			this.fallback
		);
	}
}
