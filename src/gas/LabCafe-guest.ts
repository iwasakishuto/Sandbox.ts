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

import { addSlackLink, post2slack } from "utils/slack_utils";
import { date2str, getDayOfWeek, getDaysAgo } from "utils/datetime_utils";

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
  const targetDay: Date = getDaysAgo(-7);
  const targetDay_str: string = date2str({ date: targetDay, format: "MM/dd" });
  const targetDayOfweek: string = getDayOfWeek(targetDay);
  const sheet_name: string = date2str({ date: targetDay, format: "yyyyMM" });
  const GuestSheet: GoogleAppsScript.Spreadsheet.Sheet =
    SpreadsheetApp.openById(SSID_GUEST).getSheetByName(sheet_name)!;

  /**
   * @note 一番上の列に日付が格納されている。
   * @summary 今日営業があるか。ある場合どの列にそのデータがあるか
   */
  const LastColumn: number = GuestSheet.getLastColumn();
  var targetColumn: number = -1;
  for (let c = 1; c <= LastColumn; c++) {
    let date_cell = GuestSheet.getRange(1, c).getValue();
    if (
      date_cell instanceof Date &&
      targetDay_str == date2str({ date: date_cell, format: "MM/dd" })
    ) {
      targetColumn = c;
      break;
    }
  }
  if (targetColumn == -1) return;

  /**
   * @note
   */
  const NColsPerDay: number = 5;
  const NRowsMeta: number = 2;
  const IdxRowTotalNumCounter: number = 1;
  const IdxColNumGuestsCounter: number = 0;
  const IdxColNumNewGuestsCounter: number = 1;
  const IdxColGuestsName: number = 2;
  const IdxColGuestsInvitees: number = 3;
  const IdxColGuestsRemarks: number = 4;

  const num_total_new_guests: number = GuestSheet.getRange(
    IdxRowTotalNumCounter,
    targetColumn - (2 - IdxColNumNewGuestsCounter)
  ).getValue();
  const num_total_guests: number = GuestSheet.getRange(
    IdxRowTotalNumCounter,
    targetColumn - (2 - IdxColNumGuestsCounter)
  ).getValue();

  const LastRow: number = GuestSheet.getLastRow();
  const data: any[][] = GuestSheet.getRange(
    NRowsMeta + 1,
    targetColumn - 2,
    LastRow,
    NColsPerDay
  ).getValues();

  var guests_info: string[] = [];
  for (let r = 0; r <= LastRow; r++) {
    let row: any[] = data[r];
    if (row === null || row[IdxColNumGuestsCounter] === "") break;
    guests_info.push(
      `${row[IdxColNumNewGuestsCounter] ? "☆" : "　"}【 *${
        row[IdxColNumGuestsCounter]
      }* 人】：${row[IdxColGuestsName]}（ *備考* ：${
        row[IdxColGuestsRemarks]
      }）`
    );
  }

  post2slack({
    webhookurl: SlackWebhookUrl,
    text: `ゲスト人数： *${num_total_guests}*
初来店の方： *${num_total_new_guests}*
-------------------
${guests_info.join("\n")}
-------------------
※ 当日のシフトは ${addSlackLink({
      text: "ここ",
      link: SSLINK_SHIFT,
    })} を参照。
`,
    channel: "#102-ゲスト",
    // channel: "#973_times_shuto",
    username: `${targetDay_str}(${targetDayOfweek})のゲスト`,
  });
}

global.main = main;
