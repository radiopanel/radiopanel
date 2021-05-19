import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-preview',
  templateUrl: './table-preview.component.html',
})
export class TablePreviewComponent {
	@Input() public content: string;
	@Input() public fieldType: string;

	public isArray(content: any) {
		return Array.isArray(content);
	}
}
