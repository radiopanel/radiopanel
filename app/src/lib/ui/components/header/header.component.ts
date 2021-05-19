import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})
export class HeaderComponent {
	@Input() public emptyTitle;
	@Input() public description;
	@Input() public meta;
	@Input() public backLink?;
}
