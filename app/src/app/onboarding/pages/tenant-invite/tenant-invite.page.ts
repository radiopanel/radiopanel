import { Subject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InviteService, InviteQuery } from '../../store';

@Component({
	templateUrl: './tenant-invite.page.html'
})
export class TenantInvitePageComponent implements OnInit, OnDestroy {
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	public resources$;
	public folder: string[] = [];
	public form: FormGroup;
	public loading$: Observable<boolean>;
	public invite: any;
	public loading = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private inviteQuery: InviteQuery,
		private inviteService: InviteService
	) { }

	public ngOnInit(): void {
		this.loading$ = this.inviteQuery.selectLoading();

		this.inviteService.findOne(this.route.snapshot.params.inviteUuid, true)
			.pipe(first())
			.subscribe((invite) => {
				this.form = this.formBuilder.group({
					username: ['', Validators.required],
					email: [invite.emailAddress, Validators.required],
					password: ['', Validators.required]
				});

				this.invite = invite;
			});
	}

	public async acceptInvite(e: Event) {
		if (this.loading) {
			return;
		}

		e.preventDefault();

		this.loading = true;
		const { token } = await this.inviteService.acceptInvite(this.route.snapshot.params.inviteUuid).toPromise();
		this.loading = false;
		localStorage.setItem('token', token);
		window.location.href = '/dashboard';
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
