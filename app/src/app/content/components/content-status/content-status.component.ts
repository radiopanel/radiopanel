import {
	Component,
	Input,
} from '@angular/core';

@Component({
	selector: 'app-content-status',
	templateUrl: './content-status.component.html'
})
export class ContentStatusComponent {
	@Input() public value: any;
}
