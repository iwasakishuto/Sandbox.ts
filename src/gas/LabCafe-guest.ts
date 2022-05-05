/**
 * @file スプシに書かれている情報を元に、slackで勤務者をメンションする。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2021
 * @license MIT
 * @property ID_SPREAD_SHEET_SHIFT: ID for Shift Spread Sheet.
 * @property ID_SPREAD_SHEET_GUEST: ID for Guest Spread Sheet.
 * @property SLACK_WEBHOOK_URL: URL for Slack Incoming Webhook.
 * @property SSLINK_SHIFT: Link for Shift Spread Sheet.
 */

import {
  LabCafeGuestInfo,
  LabCafeGuestInfo2string,
  LabCafeGuestsInfo,
  getGuestInformation,
} from "gas/lib/labcafe_utils";
import { addSlackLink, post2slack } from "utils/slack_utils";
import { date2str, getDaysAgo } from "utils/datetime_utils";

declare const global: {
  [x: string]: unknown;
};

/** @global プロパティに保存されたデータ */
const prop: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();
const SSID_SHIFT: string = prop.getProperty("ID_SPREAD_SHEET_SHIFT")!;
const SSID_GUEST: string = prop.getProperty("ID_SPREAD_SHEET_GUEST")!;
const SSLINK_SHIFT: string = prop.getProperty("LINK_SPREAD_SHEET_SHIFT")!;
const SlackWebhookUrl: string = prop.getProperty("SLACK_WEBHOOK_URL")!;

/** @summary スケジューラーに登録するメイン関数 */
function main() {
  const targetDate: Date = getDaysAgo(-7);
  const sheet_name: string = date2str({ date: targetDate, format: "yyyy-MM" });
  const GuestSheet: GoogleAppsScript.Spreadsheet.Sheet =
    SpreadsheetApp.openById(SSID_GUEST).getSheetByName(sheet_name)!;
  const guestsInfo: LabCafeGuestsInfo | null = getGuestInformation({
    date: targetDate,
    sheet: GuestSheet,
  });

  if (guestsInfo != null) {
    post2slack({
      webhookurl: SlackWebhookUrl,
      text: `ゲスト人数： *${guestsInfo.num_total_guests}*
初来店の方： *${guestsInfo.num_total_new_guests}*
-------------------
${guestsInfo.guests
  .map((info: LabCafeGuestInfo) => LabCafeGuestInfo2string(info))
  .join("\n")}
-------------------
※ 当日のシフトは ${addSlackLink({
        text: "ここ",
        link: SSLINK_SHIFT,
      })} を参照。
`,
      channel: "#102-ゲスト",
      // channel: "#973_times_shuto",
      username: `${guestsInfo.date_str}(${guestsInfo.dayOfweek})のゲスト`,
    });
  }
}

global.main = main;
