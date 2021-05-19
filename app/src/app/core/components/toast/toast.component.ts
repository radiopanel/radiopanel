import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';

import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
	selector: 'app-toast',
	templateUrl: './toast.component.html',
	animations: [
	  trigger('flyInOut', [
		state('inactive', style({
		  opacity: 0,
		})),
		transition('inactive => active', animate('400ms ease-out', keyframes([
		  style({
			transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
			opacity: 0,
		  }),
		  style({
			transform: 'skewX(20deg)',
			opacity: 1,
		  }),
		  style({
			transform: 'skewX(-5deg)',
			opacity: 1,
		  }),
		  style({
			transform: 'none',
			opacity: 1,
		  }),
		]))),
		transition('active => removed', animate('400ms ease-out', keyframes([
		  style({
			opacity: 1,
		  }),
		  style({
			transform: 'translate3d(100%, 0, 0) skewX(30deg)',
			opacity: 0,
		  }),
		]))),
	  ]),
	],
	preserveWhitespaces: false,
  })
  export class ToastComponent extends Toast {
	constructor(
	  protected toastrService: ToastrService,
	  public toastPackage: ToastPackage,
	) {
	  super(toastrService, toastPackage);
	}

	action(event: Event) {
	  event.stopPropagation();
	  this.toastPackage.triggerAction();
	  return false;
	}
  }
