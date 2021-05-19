import { Query } from '@datorama/akita';
import { SessionState, SessionStore } from './session.store';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionQuery extends Query<SessionState> {
	public tenant$ = this.select('tenant');
	public availableTenants$ = this.select('availableTenants');
	public user$ = this.select('user');
	public permissions$ = this.select('permissions');
	public contentTypes$ = this.select('contentTypes');
	public pageTypes$ = this.select('pageTypes');
	public features$ = this.select('features');
	public tenantMessages$ = this.select('tenantMessages');

	constructor(
		protected store: SessionStore
	) {
		super(store);
	}
}
