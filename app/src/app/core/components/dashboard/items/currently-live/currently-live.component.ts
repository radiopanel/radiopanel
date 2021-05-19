import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Component({
	templateUrl: './currently-live.component.html'
})
export class CurrentlyLiveComponent implements OnInit {
	public data: any;
	public loading: any;

	constructor(
		private http: HttpClient,
	) {}

	public ngOnInit(): void {
		this.loading = true;
		this.http.get('/api/v1/slots/live')
			.pipe(first())
			.subscribe(data => {
				this.data = data;
				this.loading = false;
			});
	}
}
