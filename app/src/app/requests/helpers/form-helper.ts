import { FormGroup } from '@angular/forms';

/**
 * Marks all controls in a form group as touched
 * @param formGroup - The form group to touch
 */
export const markFormGroupTouched = (formGroup: FormGroup) => {
	(Object as any).values(formGroup.controls).forEach(control => {
		control.markAsTouched();

		if (control.controls) {
			markFormGroupTouched(control);
		}
	});
};
