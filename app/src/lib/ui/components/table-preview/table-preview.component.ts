import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-table-preview',
	templateUrl: './table-preview.component.html',
})
export class TablePreviewComponent {
	@Input() public value: string;
	@Input() public fieldType: string;

	public isArray(value: any) {
		return Array.isArray(value);
	}
}
