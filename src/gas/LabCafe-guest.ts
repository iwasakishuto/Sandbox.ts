/**
 * @file スプシに書かれている情報を元に、slackで勤務者をメンションする。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2021
 * @license MIT
 * @property ID_SPREAD_SHEET_SHIFT: ID for Shift Spread Sheet.
 * @property ID_SPREAD_SHEET_GUEST: ID for Guest Spread Sheet.
 * @property SLACK_WEBHOOK_URL: URL for Slack Incoming Webhook.
 * @property LINK_SPREAD_SHEET_SHIFT: Link for Shift Spread Sheet.
 * @property LINK_SPREAD_SHEET_GUEST: Link for Guest Spread Sheet.
 */

import { LabCafeGuestsInfo, getGuestInformation } from "gas/lib/labcafe_utils";
import { addSlackLink, post2slack } from "utils/slack_utils";

import { date2str } from "utils/datetime_utils";

declare const global: {
  [x: string]: unknown;
};

/** @global プロパティに保存されたデータ */
const prop: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();
// const SSID_SHIFT: string = prop.getProperty("ID_SPREAD_SHEET_SHIFT")!;
const SSID_GUEST: string = prop.getProperty("ID_SPREAD_SHEET_GUEST")!;
const SSLINK_SHIFT: string = prop.getProperty("LINK_SPREAD_SHEET_SHIFT")!;
const SSLINK_GUEST: string = prop.getProperty("LINK_SPREAD_SHEET_GUEST")!;
const SlackWebhookUrl: string = prop.getProperty("SLACK_WEBHOOK_URL")!;

/** @summary スケジューラーに登録するメイン関数 */
function main() {
  var date: Date = new Date();
  var text = "";
  for (let i = 1; i <= 14; i++) {
    let sheet_name: string = date2str({ date: date, format: "yyyy-MM" });
    let guestSheet: GoogleAppsScript.Spreadsheet.Sheet | null =
      SpreadsheetApp.openById(SSID_GUEST).getSheetByName(sheet_name);
    if (guestSheet !== null) {
      let guestsInfo: LabCafeGuestsInfo | null = getGuestInformation({
        date: date,
        sheet: guestSheet,
      });
      if (guestsInfo != null) {
        text += `${guestsInfo.date_str}(${guestsInfo.dayOfweek})  【${guestsInfo.event}】 ${guestsInfo.num_total_guests}人 ( *☆${guestsInfo.num_total_new_guests}* )\n`;
      }
    }
    date.setDate(date.getDate() + 1);
  }

  post2slack({
    webhookurl: SlackWebhookUrl,
    text:
      text +
      `※ 当日のシフトは ${addSlackLink({
        text: "ここ",
        link: SSLINK_SHIFT,
      })} を、ゲストの詳細は${addSlackLink({
        text: "ここ",
        link: SSLINK_GUEST,
      })}を参照。`,
    channel: "#102-ゲスト",
    // channel: "#973_times_shuto",
    username: "現在のゲスト状況",
  });
}

global.main = main;
