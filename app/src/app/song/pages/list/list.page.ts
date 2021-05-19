import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, first, skip } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SongService, SongQuery } from '../../store';
import { FormControl } from '@angular/forms';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public songs$: Observable<any>;
	public pagination$: Observable<any>;
	public search = new FormControl('');
	public pagination: any = {};
	public currentPage = 1;

	constructor(
		private songService: SongService,
		private songQuery: SongQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.songs$ = this.songQuery.selectAll();
		this.pagination$ = this.songQuery.pagination$;

		this.search.valueChanges
			.pipe(
				debounceTime(300),
				takeUntil(this.componentDestroyed$),
				skip(1)
			).subscribe((value) => {
				this.songService.fetch(value, this.pagination)
					.pipe(first()).subscribe();
			});

		this.fetchContent();
	}

	public onPageUpdate(pagination) {
		this.pagination = pagination;
		this.songService.fetch('', pagination)
			.pipe(first()).subscribe();
	}

	public fetchContent() {
		this.songService.fetch(null)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
