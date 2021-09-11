import {
	Component,
	Input,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	OnChanges,
} from '@angular/core';

import { TableColumn } from './table.types';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnChanges {
	@Input() public rows: any[] = [];
	@Input() public columns: TableColumn[] = [];
	@Input() public categories: any[] = [];
	@Input() public activeSorting; // Just a property to use in the template, not functional
	@Input() public loading = false;
	@Input() public selectable = false;

	@Output() public orderBy = new EventEmitter();
	@Output() public selectionChange = new EventEmitter();

	public selectAllChecked: boolean;

	public sort(key, order) {
		this.activeSorting = { key: key.sort || key.value, order };
		this.orderBy.emit(this.activeSorting);
	}

	public onSelectAll() {
		this.rows.map((row) => (row.selected = this.selectAllChecked));

		const selectedRows = this.rows.filter((x) => x.selected);
		this.selectionChange.emit(selectedRows);
	}

	public onSelectRow() {
		const selectedRows = this.rows.filter((x) => x.selected);
		this.selectAllChecked = selectedRows.length > 0;

		this.selectionChange.emit(selectedRows);
	}

	public ngOnChanges() {
		if (this.selectable && this.selectAllChecked) {
			this.selectAllChecked = false;
		}
	}
}
