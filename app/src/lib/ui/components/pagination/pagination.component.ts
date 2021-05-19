import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	OnInit,
	OnDestroy
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil, skip } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Unique instance id
let id = 0;

@Component({
	selector: 'app-pagination',
	templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges, OnInit, OnDestroy {
	@Input() public itemsPerPage: number;
	@Input() public totalValues: number;
	@Input() public currentPage: number;
	@Output() public update = new EventEmitter();

	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();
	public pageSize = new FormControl(20);
	public totalPages = 0;
	public numbers = [];
	public instanceId;
	public pageSizeOptions = [
		{ value: 5, label: '5' },
		{ value: 10, label: '10' },
		{ value: 20, label: '20' },
		{ value: 50, label: '50' },
		{ value: 100, label: '100' },
		{ value: 2000, label: '2000' }
	];

	constructor() {
		id += 1; // Use this to have unique ids with multiple pagination instances on one page.
		this.instanceId = id;
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}

	public ngOnInit(): void {
		this.pageSize.valueChanges
			.pipe(skip(1), takeUntil(this.componentDestroyed$))
			.subscribe(value =>
				this.update.emit({ page: this.currentPage, pagesize: value })
			);
	}

	public ngOnChanges() {
		this.setValues();
	}

	public next() {
		this.onUpdate(Number(this.currentPage) + 1);
	}

	public prev() {
		this.onUpdate(Number(this.currentPage) - 1);
	}

	public onUpdate(i: number | string) {
		if (i === '...') {
			return;
		}

		this.update.emit({ page: i, pagesize: this.pageSize.value });
	}

	private setValues() {
		if (this.totalValues && this.itemsPerPage) {
			this.totalPages = Math.ceil(this.totalValues / this.itemsPerPage);

			const generateNumbers = Array(this.totalPages)
				.fill('')
				.map((e, i) => {
					return String(i + 1);
				});

			if (generateNumbers.length < 8) {
				return (this.numbers = generateNumbers);
			}

			if (this.currentPage < 5) {
				this.numbers = generateNumbers.slice(0, 5);
			} else if (this.currentPage > this.totalPages - 4) {
				this.numbers = generateNumbers.slice(this.totalPages - 5);
			} else {
				this.numbers = generateNumbers.slice(
					this.currentPage - 2,
					this.currentPage + 1
				);
			}

			// First page
			if (this.numbers.indexOf('1') === -1) {
				this.numbers.unshift('1');
			}

			// Last Page
			if (this.numbers.indexOf(String(this.totalPages)) === -1) {
				this.numbers.push(String(this.totalPages));
			}

			// Add dots at the beginning
			if (this.numbers.indexOf('2') === -1) {
				this.numbers.splice(1, 0, '...');
			}

			// Add dots at the end
			if (this.numbers.indexOf(String(this.totalPages - 1)) === -1) {
				this.numbers.splice(this.numbers.length - 1, 0, '...');
			}
		} else {
			this.totalPages = 0;
			this.numbers = [];
		}
	}
}
