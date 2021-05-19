import { Pipe } from '@angular/core';
import {
	DomSanitizer,
} from '@angular/platform-browser';
@Pipe({
	name: 'safe'
})
export class SafePipe {
	constructor(protected sanitizer: DomSanitizer) {}

	transform(htmlString: string): any {
		return this.sanitizer.bypassSecurityTrustHtml(htmlString);
	}
}
