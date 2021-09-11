import {
	Component,
	Input,
} from '@angular/core';

@Component({
	selector: 'app-action-view',
	templateUrl: './action-view.component.html'
})
export class ActionViewComponent {
	@Input() public value: any;
}
