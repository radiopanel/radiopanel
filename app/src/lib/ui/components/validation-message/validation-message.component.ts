import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
	selector: 'app-validation-message',
	templateUrl: './validation-message.component.html',
})
export class ValidationMessageComponent {
	@Input() errors: ValidationErrors;
}
