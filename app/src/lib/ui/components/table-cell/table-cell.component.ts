import {
	Component,
	Input,
	ComponentFactoryResolver,
	Type,
	ViewContainerRef,
	ChangeDetectorRef,
	ChangeDetectionStrategy,
	SimpleChanges,
	OnChanges,
	ComponentRef,
} from '@angular/core';
import { path } from 'ramda';

import { TableColumn } from '../table/table.types';

@Component({
	selector: 'app-table-cell',
	templateUrl: './table-cell.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableCellComponent implements OnChanges {
	@Input() public component: Type<any>;
	@Input() public column: TableColumn;
	@Input() public item: any;
	@Input() public index: number;
	@Input() public extraComponentProps: Record<string, unknown>;

	public ready = false;
	public value = null;

	private componentRef: ComponentRef<any>;

	constructor(
		public viewContainerRef: ViewContainerRef,
		private componentFactoryResolver: ComponentFactoryResolver,
		private changeDetectionRef: ChangeDetectorRef
	) {}

	public ngOnChanges(changes: SimpleChanges) {
		if (changes.component?.currentValue) {
			this.loadComponent();
		}

		if (changes.column || changes.item || changes.index) {
			this.value = this.formatValue(
				path(['column', 'currentValue'], changes),
				path(['item', 'currentValue'], changes),
				path(['index', 'currentValue'], changes)
			);

			if (this.componentRef) {
				this.updateInstanceValues();
				this.componentRef.changeDetectorRef.detectChanges();
			}
		}

		this.ready = true;
	}

	public loadComponent() {
		this.ready = false;

		const viewContainerRef = this.viewContainerRef;
		const component = this.component;

		viewContainerRef.clear();
		this.componentRef = null;

		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
		this.componentRef = viewContainerRef.createComponent(componentFactory);

		this.updateInstanceValues();

		this.changeDetectionRef.detectChanges();

		setTimeout(() => (this.ready = true));
	}

	public formatValue(column: TableColumn, item: any, index: number): any {
		if (!column) {
			return null;
		}

		const value = path(column.value.split('.'), item);

		return column.format
			? column.format(value, column.value, item, index)
			: value == null
			? '-'
			: value;
	}

	private updateInstanceValues(): void {
		this.componentRef.instance.value = this.value;
		Object.keys(this.extraComponentProps || {}).forEach((key) => {
			this.componentRef.instance[key] = this.extraComponentProps[key];
		});
	}
}
