import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
	templateUrl: './next-live.component.html'
})
export class NextLiveComponent implements OnInit {
	public data: any;
	public loading: any;

	constructor(
		private http: HttpClient,
	) {}

	public ngOnInit(): void {
		this.loading = true;
		this.http.get('/api/v1/slots', {
			params: {
				afterDate: moment().unix().toString(),
				beforeDate: moment().add(5, 'day').unix().toString()
			}
		})
			.pipe(first())
			.subscribe((data: any) => {
				this.data = (data._embedded || []).find((slot) => slot.start > moment().unix());
				this.loading = false;
			});
	}
}
