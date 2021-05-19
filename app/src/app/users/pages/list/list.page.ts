import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserQuery, UserService, InviteQuery, InviteService } from '../../store';
import { InviteModalComponent } from '../../modals';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
	templateUrl: './list.page.html'
})
export class ListPageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public users$: Observable<any>;
	public pagination$: Observable<any>;
	public invites$: Observable<any>;

	constructor(
		private userService: UserService,
		private userQuery: UserQuery,
		private inviteService: InviteService,
		private inviteQuery: InviteQuery,
		private dialog: MatDialog,
		private toastr: ToastrService,
		private activatedRoute: ActivatedRoute
	) { }

	public ngOnInit(): void {
		this.pagination$ = this.userQuery.select('pagination');
		this.users$ = this.userQuery.selectAll();
		this.invites$ = this.inviteQuery.selectAll();

		this.activatedRoute.params.subscribe(() => {
			this.fetchContent();
		});

		this.fetchContent();

	}

	public deleteInvite(e: Event, inviteUuid: string) {
		e.preventDefault();

		this.inviteService.delete(inviteUuid).pipe(first())
			.subscribe(() => {
				this.toastr.warning(`The invite has been cancelled`, 'Success!');
			});
	}

	public resendInvite(e: Event, inviteUuid: string) {
		e.preventDefault();
		this.inviteService.resend(inviteUuid).pipe(first())
			.subscribe(() => {
				this.toastr.success(`The invite has been resend`, 'Success!');
			});
	}

	public openInviteModal(e: Event) {
		e.preventDefault();

		const dialogRef = this.dialog.open(InviteModalComponent);

		dialogRef.afterClosed().pipe(first())
			.subscribe((result) => {
				if (!result) {
					return;
				}

				this.inviteService.create(result).pipe(first())
					.subscribe((inviteResult) => {
						this.toastr.success(`${inviteResult.emailAddress} has been invited successfully`, 'All went ok');
					});
			});
	}

	public fetchContent() {
		this.userService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();

		this.inviteService.fetch()
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public onPageUpdate(pagination) {
		this.userService.fetch(pagination)
			.pipe(
				takeUntil(this.componentDestroyed$)
			).subscribe();
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
