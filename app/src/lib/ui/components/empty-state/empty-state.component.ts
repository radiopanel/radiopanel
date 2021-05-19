import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
})
export class EmptyStateComponent {
	@Input() public empty = true;
	@Input() public image: string;
	@Input() public emptyTitle: string;
	@Input() public description: string;
	@Input() public size = 'normal';
}
