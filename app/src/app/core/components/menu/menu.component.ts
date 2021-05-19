import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html'
})
export class MenuComponent {
	@Input() public links;
	@Input() public description: string;
}
