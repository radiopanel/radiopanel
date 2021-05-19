import { Subject, Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ResourceQuery, ResourceService, SessionQuery } from '../../../store/index';
import { Resource } from '../../../store/resources/resources.store';

@Component({
	selector: 'app-resources',
	templateUrl: './resource.component.html'
})
export class ResourceComponent implements OnInit, OnDestroy {
	@Input() public allowedExtensions: string[] = null;
	@Input() public enabledActions: string[] = [];
	@Input() public multiple = false;
	@Input() public initialDirectory: string = null;

	@Output() public resourceSelect: EventEmitter<string | string[]> = new EventEmitter<string | string[]>();
	@Output() public directoryChange: EventEmitter<string> = new EventEmitter<string>();

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public selectedResources: string[] = [];
	public tenant: string;
	public resources$;
	public loading$: Observable<boolean>;
	public resources;
	public folder: string[] = [];

	constructor(
		private resourceService: ResourceService,
		private resourceQuery: ResourceQuery,
		private sessionQuery: SessionQuery,
	) { }

	public ngOnInit(): void {
		if (this.initialDirectory) {
			this.folder = this.initialDirectory.split('/');
		}

		this.resources$ = this.resourceQuery.selectAll();
		this.loading$ = this.resourceQuery.selectLoading();
		this.fetchResources();
		this.sessionQuery.tenant$
			.pipe(
				first()
			)
			.subscribe((tenantData) => {
				this.tenant = tenantData.uuid;
			});
	}

	public selectResource(fileName: string) {
		this.resourceSelect.emit(this.folder.join('/') + '/' + fileName);
	}

	public removeResource(e: Event, resource: any) {
		e.preventDefault();
		e.stopPropagation();

		if (!window.confirm('Are you sure you wish to do this?')) {
			return;
		}

		if (resource.type === 'directory') {
			return this.resourceService.removeDirectory((this.folder.join('/') + '/' + resource.name).replace(/^\//, ''))
				.pipe(first())
				.subscribe();
		}

		this.resourceService.remove((this.folder.join('/') + '/' + resource.name).replace(/^\//, ''))
				.pipe(first())
				.subscribe();
	}

	public goToParentFolder() {
		this.folder.pop();
		this.directoryChange.emit(this.folder.join('/'));
		this.fetchResources();
	}

	public toggleSelectAll(e: Event) {
		this.resources
			.filter((resource) => resource.extension && this.allowedExtensions.includes(resource.extension.toLowerCase()))
			.forEach(resource => {
				if (!(e.target as any).checked) {
					this.selectedResources.splice(this.selectedResources.indexOf(this.getFullPath(resource.name)));
					return this.resourceSelect.emit(this.selectedResources);
				}

				this.selectedResources.push(this.folder.join('/') + '/' + resource.name);
				this.resourceSelect.emit(this.selectedResources);
			});
	}

	public isSelectable(resource: Resource) {
		if (resource.type === 'directory' || !this.allowedExtensions) {
			return true;
		}

		return this.allowedExtensions.includes(resource.extension.toLowerCase());
	}

	public isActionEnabled(action: string) {
		return !!this.enabledActions.includes(action);
	}

	public handleResourceSelect(fileName: string) {
		if (!this.multiple) {
			return this.resourceSelect.emit(this.folder.join('/') + '/' + fileName);
		}

		if (this.isResourceSelected(fileName)) {
			this.selectedResources.splice(this.selectedResources.indexOf(this.getFullPath(fileName)));
			return this.resourceSelect.emit(this.selectedResources);
		}

		this.selectedResources.push(this.folder.join('/') + '/' + fileName);
		this.resourceSelect.emit(this.selectedResources);
	}

	public getFullPath(fileName: string) {
		return this.folder.join('/') + '/' + fileName;
	}

	public isResourceSelected(fileName: string) {
		return this.selectedResources.includes(this.folder.join('/') + '/' + fileName);
	}

	public goToChildFolder(dir: string) {
		this.folder.push(dir);
		this.directoryChange.emit(this.folder.join('/'));
		this.fetchResources();
	}

	private fetchResources(): void {
		this.resourceService.fetch(this.folder.join('/'))
			.pipe(
				first()
			).subscribe((resources) => {
				this.resources = resources;
			});
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
