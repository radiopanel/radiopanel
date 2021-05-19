import * as pluralize from 'pluralize';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'singular' })
export class SingularPipe implements PipeTransform {
	transform(value: any, ...args: any[]) {
		if (!value) {
			return;
		}

		return pluralize.singular(value);
	}
}
