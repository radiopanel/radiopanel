import * as moment from 'moment';
import {
	Component,
	ChangeDetectionStrategy,
	ViewChild,
	OnInit,
	ChangeDetectorRef,
	ElementRef,
} from '@angular/core';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import {
	CalendarEvent,
	CalendarView,
	CalendarEventTitleFormatter
} from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { EventModalComponent } from '../../modals';
import { SlotService, SlotQuery } from '../../store';
import { first, map, finalize, takeUntil, debounceTime } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { SlotTypeService, SessionQuery } from '~lib/store';
import { CustomEventTitleFormatter } from './event-title.formatter';
import { ToastrService } from 'ngx-toastr';
import { pathOr, path, prop } from 'ramda';
import { SocketService } from '../../../core/services';

function floorToNearest(amount: number, precision: number) {
	return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
	return Math.ceil(amount / precision) * precision;
}

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: 'timetable.page.html',
	providers: [
		{
			provide: CalendarEventTitleFormatter,
			useClass: CustomEventTitleFormatter,
		},
	],
})
export class TimetablePageComponent implements OnInit {
	public view: CalendarView = CalendarView.Week;
	public CalendarView = CalendarView;
	public viewDate: Date = new Date();
	public dragToCreateActive = false;
	public slots: CalendarEvent[];
	public permissions: string[];
	public user: any;
	public tenant: any;
	public activeDayIsOpen = true;
	private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

	@ViewChild('timetableRoot') timetableRoot: ElementRef;

	constructor(
		private slotTypeService: SlotTypeService,
		private slotService: SlotService,
		private slotQuery: SlotQuery,
		private dialog: MatDialog,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
		private sessionQuery: SessionQuery,
		private socketService: SocketService,
	) {}

	private fetchData(): void {
		// 1 Day buffer
		const buffer = 1 * 24 * 60 * 60;
		this.slotService
			.fetch({
				beforeDate: (moment(this.viewDate).endOf('isoWeek').unix() + buffer).toString(),
				afterDate: (moment(this.viewDate).startOf('isoWeek').unix() - buffer).toString()
			})
			.pipe(first())
			.subscribe();

		this.sessionQuery.tenant$.pipe(first()).subscribe(tenant => this.tenant = tenant);
	}

	public ngOnInit(): void {
		this.fetchData();

		this.socketService.socket.on('timetable-updated', () => {
			this.fetchData();
		});

		// TODO: add takeUntill
		this.sessionQuery.user$.subscribe((user) => this.user = user);
		this.sessionQuery.permissions$.subscribe((permissions) => this.permissions = permissions);

		this.slotTypeService
			.fetch()
			.pipe(first())
			.subscribe();

		this.slotQuery.selectAll()
			.pipe(
				map(slots => {
					return slots.map((slot) => ({
						...slot,
						id: (slot as any).uuid,
						start: moment.unix(Number(slot.start)).toDate(),
						end: moment.unix(Number(slot.end) - 1).toDate(),
						color: {
							primary: pathOr('#000', ['slotType', 'color'])(slot),
							secondary: pathOr('#000', ['slotType', 'color'])(slot)
						},
						meta: {
							...(slot as any).user,
							originalTimings: {
								start: moment.unix(Number(slot.start)).toDate(),
								end: moment.unix(Number(slot.end)).toDate(),
							},
							editable: this.permissions.includes('timetable/update-other')
								|| path(['user', 'uuid'])(slot) === prop('uuid')(this.user)
						}
					}));
				})
			).subscribe((slots) => {
				this.slots = slots;
				this.refresh();
			});
	}

	public handleViewDateChange() {
		this.fetchData();
	}

	public handleSlotEdit(event: any): void {
		if (!event.meta.editable) {
			return;
		}

		const dialogRef = this.dialog.open(EventModalComponent, {
			data: { event, user: this.user, permissions: this.permissions, tenant: this.tenant }
		});

		dialogRef
			.afterClosed()
			.pipe(first())
			.subscribe(data => {
				if (!data) {
					return;
				}

				if (data === 'delete') {
					return this.deleteSlot(event.id, event.start);
				}

				if (data === 'temp-delete') {
					return this.tempDeleteSlot(event.id, event.start);
				}

				this.slotService.update(event.id, moment(event.start).unix(), {
					...data,
					start: moment(data.start).unix(),
					end: moment(data.end).unix(),
				})
					.pipe(first())
					.subscribe(() => {
						this.toastr.success('Slot has been updated', 'Success');
						this.refresh();
					});
			});
	}

	public deleteSlot(slotUuid: string, slotStart: string) {
		this.slotService.delete(slotUuid, moment(slotStart).unix())
			.pipe(first())
			.subscribe(() => {
				this.toastr.warning('Slot has been deleted', 'Success');
				this.refresh();
			});
	}

	public tempDeleteSlot(slotUuid: string, slotStart: string) {
		this.slotService.delete(slotUuid, moment(slotStart).unix(), {
			tempDelete: true,
			// Not the most beautiful solution but ok
			overwriteDate: moment(slotStart).format('YYYY-w')
		})
			.pipe(first())
			.subscribe(() => {
				this.toastr.warning('Slot has been deleted', 'Success');
				this.refresh();
			});
	}

	public startDragToCreate(
		segment: any,
		mouseDownEvent: MouseEvent,
		segmentElement: HTMLElement
	) {
		const { tenant } = this.sessionQuery.getValue();

		const temporarySlot: CalendarEvent = {
			id: this.slots.length,
			title: 'New slot',
			start: segment.date,
			end: moment(segment.date).add((tenant?.settings?.minimumSlotDuration || 30) > 60 ? (tenant?.settings?.minimumSlotDuration || 30) : 60, 'minutes').toDate(),
			color: {
				primary: '#000',
				secondary: '#000'
			},
			meta: {
				tmpEvent: true,
				...this.user
			}
		};

		this.slots = [...this.slots, temporarySlot];
		const scrollOffset = document.querySelector('.o-content').scrollTop;
		const segmentPosition = segmentElement.getBoundingClientRect();
		this.dragToCreateActive = true;
		const endOfView = endOfWeek(this.viewDate, {
			weekStartsOn: 1
		});

		fromEvent(document, 'mousemove')
			.pipe(
				finalize(() => {
					delete temporarySlot.meta.tmpEvent;
					this.dragToCreateActive = false;
					this.handleSlotCreate(temporarySlot);
					this.refresh();
				}),
				takeUntil(fromEvent(document, 'mouseup')),
				// debounceTime(10)
			)
			.subscribe((mouseMoveEvent: MouseEvent) => {
				const boundingRect = this.timetableRoot.nativeElement.getBoundingClientRect();
				const minutesDiff = ceilToNearest(
					mouseMoveEvent.clientY - segmentPosition.top - (boundingRect.top - this.timetableRoot.nativeElement.offsetTop) - scrollOffset,
					30
				);

				const daysDiff =
					floorToNearest(
						mouseMoveEvent.clientX - segmentPosition.left,
						segmentPosition.width
					) / segmentPosition.width;

				const newEnd = addDays(
					addMinutes(segment.date, minutesDiff),
					daysDiff
				);

				const totalDiff = (minutesDiff + (daysDiff * 24 * 60));

				if (newEnd > segment.date && newEnd < moment(endOfView).add(1, 'minute').toDate() && totalDiff <= (tenant?.settings?.maximumSlotDuration || 1440) && totalDiff >= (tenant?.settings?.minimumSlotDuration || 30)) {
					temporarySlot.end = newEnd;
				}

				this.refresh();
			});
	}

	private refresh() {
		this.slots = [...this.slots];
		this.cdr.detectChanges();
	}

	public handleSlotCreate(event): void {
		const dialogRef = this.dialog.open(EventModalComponent, {
			data: { event, user: this.user, permissions: this.permissions, tenant: this.tenant }
		});

		dialogRef
			.afterClosed()
			.pipe(first())
			.subscribe(data => {
				this.slots.splice(event.id, 1);
				this.refresh();

				if (!data) {
					return;
				}

				this.slotService.create({
					...data,
					start: moment(data.start).unix(),
					end: moment(data.end).unix(),
				})
					.pipe(first())
					.subscribe(() => {
						this.refresh();
						this.toastr.success('Slot has been booked', 'Success');
					});
			});
	}

	setView(view: CalendarView) {
		this.view = view;
	}

	public ngOnDestroy(): void {
		this.componentDestroyed$.next(true);
		this.componentDestroyed$.complete();
	}
}
