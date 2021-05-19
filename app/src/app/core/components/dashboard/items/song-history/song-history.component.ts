import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';

@Component({
	templateUrl: './song-history.component.html'
})
export class SongHistoryComponent implements OnInit {
	public data: any;
	public loading: any;

	constructor(
		private http: HttpClient,
	) {}

	public ngOnInit(): void {
		this.loading = true;
		this.http.get('/api/v1/song-history', {
			params: {
				pagesize: '3',
			}
		})
			.pipe(first())
			.subscribe((data: any) => {
				this.data = data._embedded || [];
				this.loading = false;
			});
	}
}
