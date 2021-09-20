import { Subject } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs/operators';

import { ResourceService } from '../../../../lib/store';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public selectedItems: string[] = [];
	public currentDirectory = '';
	public initialDirectory = this.route.snapshot.queryParamMap.get('directory');

	constructor(
		private resourceService: ResourceService,
		private dialog: MatDialog,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	public ngOnInit(): void {

	}

	public handleSelection(items: string[]) {
		this.selectedItems = items;
	}

	public handleDirectoryChange(directory: string): void {
		this.currentDirectory = directory;
		this.router.navigate(['.'], { relativeTo: this.route, queryParams: { directory }});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
