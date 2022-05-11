/**
 * @file A collection of functions useful for handling Google Calendar.
 * @author Shuto Iwasaki <cabernet.rock@gmail.com>
 * @copyright Iwasaki Shuto 2022
 * @license MIT
 */

import { date2str } from "utils/datetime_utils";

export type GoogleCalendarEvent = {
  title: string;
  isAllDayEvent: boolean;
  start_time: string;
  end_time: string;
  event: GoogleAppsScript.Calendar.CalendarEvent;
};

export function listUpCalendarEvent({
  id,
  date = new Date(),
}: {
  id: string;
  date?: Date;
}): GoogleCalendarEvent[] {
  const cal: GoogleAppsScript.Calendar.Calendar =
    CalendarApp.getCalendarById(id);
  const events: GoogleAppsScript.Calendar.CalendarEvent[] =
    cal.getEventsForDay(date);

  return events.map((event) => ({
    title: event.getTitle(),
    isAllDayEvent: event.isAllDayEvent(),
    start_time: event.isAllDayEvent()
      ? date2str({
          date: event.getAllDayStartDate(),
          format: "MM/dd",
        })
      : date2str({
          date: event.getStartTime(),
          format: "MM/dd HH:mm",
        }),
    end_time: event.isAllDayEvent()
      ? date2str({
          date: event.getAllDayEndDate(),
          format: "MM/dd",
        })
      : date2str({
          date: event.getEndTime(),
          format: "MM/dd HH:mm",
        }),
    event: event,
  }));
}

export function calendarEvents2Text(events: GoogleCalendarEvent[]): string {
  return events
    .map(
      (event: GoogleCalendarEvent) =>
        `[${event.start_time}-${event.end_time}] ${event.title}`
    )
    .join("\n");
}

export function createCalendarEvent({
  id,
  title,
  startTime,
  endTime,
}: {
  id: string;
  title: string;
  startTime: GoogleAppsScript.Base.Date;
  endTime: GoogleAppsScript.Base.Date;
}): GoogleAppsScript.Calendar.CalendarEvent {
  const cal: GoogleAppsScript.Calendar.Calendar =
    CalendarApp.getCalendarById(id);
  return cal.createEvent(title, startTime, endTime);
}
