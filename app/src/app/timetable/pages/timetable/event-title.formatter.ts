import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
	weekTooltip(event: CalendarEvent, title: string) {
		if (!event.meta || !event.meta.tmpEvent) {
			return super.weekTooltip(event, title);
		}
	}

	dayTooltip(event: CalendarEvent, title: string) {
		if (!event.meta || !event.meta.tmpEvent) {
			return super.dayTooltip(event, title);
		}
	}

	week(event: CalendarEvent): string {
		return `
			<div class="o-calendar__wrapper">
				<div class="o-calendar__info">
					<p class="o-calendar__title">${event.title}</p>
					<p class="o-calendar__user">${event.meta.username}</p>
				</div>
				${!event.meta?.tmpEvent ? `
					<div class="o-calendar__time">
						<span>
							${new DatePipe('en_US').transform(
								event.start,
								'HH:mm',
								'en_US'
							)}
							</span>
							<span>${new DatePipe('en_US').transform(
								event.end,
								'HH:mm',
								'en_US'
							)}
						</span>
					</div>
				` : ''}
			</div>
		`;
	}
}
