import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-image-tooltip',
	templateUrl: './image-tooltip.component.html',
})
export class ImageTooltipComponent {
	@Input() imageUrl: string;
}
