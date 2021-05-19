import { Component, Input, AfterViewInit, ViewChild, ViewContainerRef, OnDestroy, ComponentFactoryResolver, Injector, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { DashboardComponentRegistry } from '../../services';

@Component({
	selector: 'app-dashboard-item',
	templateUrl: './dashboard-item.component.html'
})
export class DashboardItemComponent implements AfterViewInit, OnDestroy {
	@ViewChild('inputContainer', { read: ViewContainerRef, static: false }) public inputContainer: ViewContainerRef;

	@Input() public type: string;
	@Input() public index: number;
	@Input() public configuration: any = null;

	@Output() public removeItem = new EventEmitter();
	@Output() public applyConfiguration = new EventEmitter();

	public title;

	private component$ = new BehaviorSubject<any>(null);
	private componentDestroyed$ = new Subject<boolean>();
	private instance: any;

	constructor(
	  private componentFactoryResolver: ComponentFactoryResolver,
	  private componentRegistry: DashboardComponentRegistry,
	) { }

	public ngAfterViewInit() {
		this.component$
			.pipe(
				takeUntil(this.componentDestroyed$),
				filter((component) => !!component),
			)
			.subscribe(({ component, title }: any) => {
				setTimeout(() => {
					this.inputContainer.clear();

					const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
					const componentRef = this.inputContainer.createComponent(componentFactory);
					this.instance = componentRef.instance as any;
					this.instance.configuration = this.configuration;
					this.instance.applyConfiguration = this.applyConfiguration;

					this.title = title;

					componentRef.changeDetectorRef.detectChanges();
				});
			});
	  }

	public ngOnChanges(changes: SimpleChanges) {
		if (!changes.type) {
			return;
		}

		if (changes.type) {
			const component = this.componentRegistry.getComponent(changes.type.currentValue);

			this.component$.next(component);
		}
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
