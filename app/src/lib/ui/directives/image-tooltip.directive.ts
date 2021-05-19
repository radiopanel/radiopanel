import { Directive, OnInit, ElementRef, HostListener, ComponentRef, Input } from '@angular/core';
import { OverlayPositionBuilder, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { ImageTooltipComponent } from '../components/image-tooltip/image-tooltip.component';

@Directive({ selector: '[appImageTooltip]' })
export class ImageTooltipDirective implements OnInit {
	@Input('appImageTooltip') imageurl: string;
	private overlayRef: OverlayRef;

	constructor(
		private overlayPositionBuilder: OverlayPositionBuilder,
		private elementRef: ElementRef,
		private overlay: Overlay
	) {}

	ngOnInit() {
		const positionStrategy = this.overlayPositionBuilder
			.flexibleConnectedTo(this.elementRef)
			.withPositions([
				{
					originX: 'end',
					originY: 'center',
					overlayX: 'start',
					overlayY: 'center'
				}
			]);

		// Connect position strategy
		this.overlayRef = this.overlay.create({ positionStrategy });
	}

	@HostListener('mouseenter')
	show() {
		// Create tooltip portal
		const tooltipPortal = new ComponentPortal(ImageTooltipComponent);

		// Attach tooltip portal to overlay
		const tooltipRef: ComponentRef<ImageTooltipComponent> = this.overlayRef.attach(tooltipPortal);

		// Pass content to tooltip component instance
		tooltipRef.instance.imageUrl = this.imageurl;
	}

	@HostListener('mouseout')
	hide() {
		this.overlayRef.detach();
	}
}
