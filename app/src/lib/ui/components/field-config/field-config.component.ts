import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-field-config',
	templateUrl: 'field-config.component.html',
})
export class FieldConfigComponent {
	@Input() open = false;
	@Input() item: any;
	@Input() contentFields: any;

	@Output() toggleOpen: EventEmitter<void> = new EventEmitter<void>();
	@Output() remove: EventEmitter<void> = new EventEmitter<void>();

	public findFieldConfiguration(identifier) {
		return (this.contentFields || []).find((x) => x.identifier === identifier);
	}

	public toggleFieldExpansion(e: Event) {
		e.preventDefault();
		this.toggleOpen.emit();
	}

	public removeField(e: Event) {
		e.preventDefault();
		this.remove.emit();
	}

}
