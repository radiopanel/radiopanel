import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestModalComponent } from '../../modals';
import { RequestService, RequestQuery } from '../../store';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Request } from '../../store/request/request.store';
import { Observable } from 'rxjs';
import { SocketService } from '../../../core/services';

@Component({
	templateUrl: 'list.page.html'
})
export class ListPageComponent implements OnInit {
	public requests$: Observable<Request[]>;
	public loading$: Observable<boolean>;

	constructor(
		private requestService: RequestService,
		private requestQuery: RequestQuery,
		private dialog: MatDialog,
		private toastr: ToastrService,
		private socketService: SocketService,
	) {}

	private fetchData(): void {
		this.requestService
			.fetch()
			.pipe(first())
			.subscribe();
	}

	public ngOnInit(): void {
		this.fetchData();

		this.socketService.socket.on('requests-updated', () => {
			this.fetchData();
		});

		this.loading$ = this.requestQuery.selectLoading();
		this.requests$ = this.requestQuery.selectAll();
	}

	public handleCreateRequest(): void {
		const dialogRef = this.dialog.open(RequestModalComponent, {
			data: { event }
		});

		dialogRef
			.afterClosed()
			.pipe(first())
			.subscribe(data => {
				if (!data) {
					return;
				}

				this.requestService
					.create(data)
					.pipe(first())
					.subscribe(() => {
						this.toastr.success(
							'Request has been created',
							'Success'
						);
					});
			});
	}

	handleDelete(requestUuid: string): void {
		this.requestService
			.delete(requestUuid)
			.pipe(first())
			.subscribe();
	}

	clearAll(): void {
		this.requestService
			.clearAll()
			.pipe(first())
			.subscribe();
	}
}
