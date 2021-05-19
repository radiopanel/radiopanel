import { Observable, Subject } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';

import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl } from '@angular/forms';
import { PermissionQuery, PermissionService, SessionQuery } from '~lib/store';
import { compose, pick, propOr, filter } from 'ramda';

@Component({
	selector: 'app-permission-overwriter',
	templateUrl: './permission-overwriter.component.html',
	providers: [
		{
			provide: [],
			useExisting: forwardRef(() => PermissionOverwriterComponent),
			multi: true,
		},
	],
})
export class PermissionOverwriterComponent implements OnInit, OnDestroy, ControlValueAccessor {
	@Input() enabledPermissions: Record<string, string>[] = [];

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public categories: any;
	public permissions$: Observable<any>;
	public features$: Observable<any>;
	public control: FormGroup;
	public updateValue = (_: any) => {};

	constructor(
		public ngControl: NgControl,
		public permissionService: PermissionService,
		public permissionQuery: PermissionQuery,
		public sessionQuery: SessionQuery,
		public formBuilder: FormBuilder,
	) {
		ngControl.valueAccessor = this;
	}

	public getPermissionCountByState(permissions: any[], state: string): number {
		// Jesus fuck, these typings suck ass...
		return Object.keys((compose as any)(
			filter(n => n === state),
			pick(permissions.map(x => x.value))
		)(this.control.value)).length;
	}

	public ngOnInit() {
		this.permissions$ = this.permissionQuery.results$
			.pipe(
				tap((permissions) => {
					if (!permissions) {
						return;
					}

					this.categories = permissions;
					const flatPermissions = (permissions || []).reduce((acc, category) => ({
						...acc,
						...category.groups.reduce((groupAcc, group) => ({
							...groupAcc,
							...group.permissions
								.reduce((permAcc, x) => {
									const matchedPermission = this.enabledPermissions
										.find((permission) => permission.permission === x.value);
									return { ...permAcc, [x.value]: [propOr('inherit', 'permissionType')(matchedPermission)] };
								}, {})
						}), {})
					}), {});

					this.control = this.formBuilder.group(flatPermissions);

					this.control.valueChanges.pipe(
						takeUntil(this.componentDestroyed$),
					).subscribe((value) => {
						this.propagateChange(value);
					});
				})
			);

		this.features$ = this.sessionQuery.features$;

		this.permissionService.fetch().pipe(first()).subscribe();
	}

	private propagateChange(value: any): void {
		if (this.updateValue) {
			return this.updateValue(value);
		}

		if (this.control) {
			this.control.setValue(value);
		}
	}

	public ngOnDestroy() {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public writeValue(value: any) {
		setTimeout(() => this.control && this.control.setValue(value));
	}

	public registerOnChange(fn: any) {
		this.updateValue = fn;
	}

	public registerOnTouched() {}
}
