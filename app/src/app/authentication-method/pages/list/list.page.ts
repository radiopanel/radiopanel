import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, first, skip } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationMethodService, AuthenticationMethodQuery } from '../../store';
import { FormControl } from '@angular/forms';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public authenticationMethods$: Observable<any>;
	public pagination$: Observable<any>;
	public loading$: Observable<boolean>;
	public search = new FormControl('');
	public pagination: any = {};
	public currentPage = 1;

	constructor(
		private authenticationMethodService: AuthenticationMethodService,
		private authenticationMethodQuery: AuthenticationMethodQuery,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.authenticationMethods$ = this.authenticationMethodQuery.selectAll();
		this.loading$ = this.authenticationMethodQuery.selectLoading();
		this.pagination$ = this.authenticationMethodQuery.pagination$;

		this.search.valueChanges
			.pipe(
				skip(1),
				debounceTime(300),
				takeUntil(this.componentDestroyed$)
			).subscribe((value) => {
				this.authenticationMethodService.fetch(value, this.pagination)
					.pipe(first()).subscribe();
			});

		this.fetchContent();
	}

	public onPageUpdate(pagination) {
		this.pagination = pagination;
		this.authenticationMethodService.fetch('', pagination)
			.pipe(first()).subscribe();
	}

	public fetchContent() {
		this.authenticationMethodService.fetch(null)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
