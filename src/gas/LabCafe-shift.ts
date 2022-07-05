/**
 * @file スプシに書かれている情報を元に、slackで勤務者をメンションする。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2022
 * @license MIT
 * @property ID_SPREAD_SHEET_SHIFT: ID for Shift Spread Sheet.
 * @property ID_SPREAD_SHEET_GUEST: ID for Guest Spread Sheet.
 * @property SLACK_WEBHOOK_URL: URL for Slack Incoming Webhook.
 */

import {
  LabCafeGuestInfo,
  LabCafeGuestInfo2string,
  LabCafeGuestsInfo,
  LabCafeShiftInfo,
  getGuestInformation,
  getShiftInformation,
} from "gas/lib/labcafe_utils";

import { date2str } from "utils/datetime_utils";
import { post2slack } from "utils/slack_utils";

declare const global: {
  [x: string]: unknown;
};

/** @global プロパティに保存されたデータ */
const prop: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();
const SSID_SHIFT: string = prop.getProperty("ID_SPREAD_SHEET_SHIFT")!;
const SSID_GUEST: string = prop.getProperty("ID_SPREAD_SHEET_GUEST")!;
const SlackWebhookUrl: string = prop.getProperty("SLACK_WEBHOOK_URL")!;

/** @summary スケジューラーに登録するメイン関数 */
function main() {
  var text: string = "";
  const today: Date = new Date();
  const sheet_name: string = date2str({ date: today, format: "yyyy-MM" });

  // Get Shift Information.
  const ShiftSheet: GoogleAppsScript.Spreadsheet.Sheet =
    SpreadsheetApp.openById(SSID_SHIFT).getSheetByName(sheet_name)!;
  const shiftInfo: LabCafeShiftInfo | null = getShiftInformation({
    date: today,
    sheet: ShiftSheet,
  });
  if (shiftInfo != null) {
    text += `*【${shiftInfo.date_str}(${shiftInfo.dayOfweek})】*
    営業時間　： *${shiftInfo.business_hours}*
    営業責任者： ${shiftInfo.executive}
    スタッフ　： ${shiftInfo.staffNames.join("・")}
    `;
  }

  // Get Guests Information.
  const GuestSheet: GoogleAppsScript.Spreadsheet.Sheet =
    SpreadsheetApp.openById(SSID_GUEST).getSheetByName(sheet_name)!;
  const guestsInfo: LabCafeGuestsInfo | null = getGuestInformation({
    date: today,
    sheet: GuestSheet,
  });
  if (guestsInfo != null) {
    text += `*【ゲスト】*
人数　： *${guestsInfo.num_total_guests}*
初来店： *${guestsInfo.num_total_new_guests}*
-------------------
${guestsInfo.guests
  .map((info: LabCafeGuestInfo) => LabCafeGuestInfo2string({ info: info }))
  .join("\n")}`;
  }

  // guestsInfo

  post2slack({
    webhookurl: SlackWebhookUrl,
    text: text,
    channel: "#101-シフト_営業報告",
    // channel: "#973_times_shuto",
    username: "Today's Staff",
  });
}

global.main = main;
