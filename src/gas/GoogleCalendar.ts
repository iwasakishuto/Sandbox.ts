/**
 * @OnlyCurrentDoc
 */

import {
  GoogleCalendarEvent,
  calendarEvents2Text,
  listUpCalendarEvent,
} from "gas/lib/google_calendar";

import { post2slack } from "utils/slack_utils";

declare const global: {
  [x: string]: unknown;
};

/** @global プロパティに保存されたデータ */
const prop: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();
const GOOGLE_CALENDAR_ID: string = prop.getProperty("ID_GOOGLE_CALENDAR")!;
const SlackWebhookUrl: string = prop.getProperty("SLACK_WEBHOOK_URL")!;

function main() {
  const events: GoogleCalendarEvent[] = listUpCalendarEvent({
    id: GOOGLE_CALENDAR_ID,
    date: new Date(),
  });

  post2slack({
    text: calendarEvents2Text(events),
    webhookurl: SlackWebhookUrl,
    channel: "",
    username: "",
  });
}

global.main = main;
