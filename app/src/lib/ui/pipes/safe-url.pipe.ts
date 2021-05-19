import { Pipe } from '@angular/core';
import {
	DomSanitizer,
} from '@angular/platform-browser';
@Pipe({
	name: 'safeUrl'
})
export class SafeUrlPipe {
	constructor(protected sanitizer: DomSanitizer) {}

	transform(htmlString: string): any {
		return this.sanitizer.bypassSecurityTrustResourceUrl(htmlString);
	}
}
