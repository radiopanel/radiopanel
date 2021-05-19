import * as pluralize from 'pluralize';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'plural' })
export class PluralPipe implements PipeTransform {
	transform(value: any, ...args: any[]) {
		if (!value) {
			return;
		}

		return pluralize.plural(value);
	}
}
