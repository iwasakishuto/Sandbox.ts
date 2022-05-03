/**
 * @file スプシに書かれている情報を元に、slackで勤務者をメンションする。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2021
 * @license MIT
 */

import { SlackInfo, name2slackMention, post2slack } from "utils/slack_utils";
import { getDayOfWeek, toMMdd } from "utils/datetime_utils";

/** @global スプシ内の名前からslack内でのIDへの辞書 */
const LabCafeSlackInformation: SlackInfo[] = [
  { name: "石橋", slackId: "U03DQQ14F17" },
  { name: "大野", slackId: "U03E7RHTJHE" },
  { name: "南雲", slackId: "U03DENW1JKW" },
  // { name: "宮田", slackId: "UNA68UK7U" },
  // { name: "岡本", slackId: "US8GFHXMW" },
  { name: "紺野", slackId: "U03C3JW67RV" },
  { name: "河村", slackId: "U038N75F0QG" }, // ゆりっぺ
  { name: "王", slackId: "U03D851GRGE" },
  { name: "安田", slackId: "U03D5FZT9QE" },
  { name: "新倉", slackId: "U03DC5LRW11" },
  { name: "宮下", slackId: "U03D5G07PSS" },
  { name: "岩崎", slackId: "U03DC7T4E4S" },
  { name: "吉田", slackId: "U038041DAAE" },
  { name: "佐藤", slackId: "U03D5G0GJQN" },
];

/** @global プロパティに保存されたデータ */
const prop: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();
const SSID_SHIFT: string = prop.getProperty("ID_SPREAD_SHEET_SHIFT")!;
const SSID_GUEST: string = prop.getProperty("ID_SPREAD_SHEET_GUEST")!;
const SlackWebhookUrl: string = prop.getProperty("WEBHOOK_URL")!;

/**
 * @summary Dateオブジェクトからその日に参照すべきスプレッドシートの名前取得する。
 * @param {Date} date Dateオブジェクト。
 * @return {string} 月名（MM月）
 */
export function getTargetSheetName(date: Date): string {
  var month: number = Number(date.getMonth() + 1);
  var day: number = Number(date.getDate());
  if (day > 25) {
    month = month == 12 ? 1 : month + 1;
  }
  return `${Number(month)}月`;
  // return `${("0" + month).slice(-2)}月`;
}

/** @summary スケジューラーに登録するメイン関数 */
function main() {
  const date: Date = new Date();
  const today: string = toMMdd(date);
  const dayOfweek: string = getDayOfWeek(date);
  const sheet_name: string = getTargetSheetName(date);
  const TargetSheet: GoogleAppsScript.Spreadsheet.Sheet =
    SpreadsheetApp.openById(SSID_SHIFT).getSheetByName(sheet_name)!;

  /**
   * @note 一番上の列に日付が格納されている。
   * @summary 今日営業があるか。ある場合どの列にそのデータがあるか
   */
  const LastColumn: number = TargetSheet.getLastColumn();
  var targetColumn = -1;
  for (let c = 1; c <= LastColumn; c++) {
    let date_cell = TargetSheet.getRange(1, c).getValue();
    if (date_cell instanceof Date && today == toMMdd(date_cell)) {
      targetColumn = c;
      break;
    }
  }
  if (targetColumn == -1) return;

  /**
   * @note 営業時間は、二行目に格納されている。
   */
  const hoursRow: number = 2;
  const business_hours: string = TargetSheet.getRange(
    hoursRow,
    targetColumn
  ).getValue();

  /**
   * @note 勤務に入るスタッフの背景色は "#ffffff" ではない。
   * @summary スタッフのIDを調べる。
   */
  var staffNames: string[] = [];
  var executive = "";
  var nanoka = false;
  const LastRow = TargetSheet.getLastRow();
  const nameColumn = 1;
  for (let r = 3; r <= LastRow; r++) {
    let cell = TargetSheet.getRange(r, targetColumn);
    let value = cell.getValue();
    let bgcolor = cell.getBackground();
    let staffName = TargetSheet.getRange(r, nameColumn).getValue();
    // 白背景じゃない === 営業スタッフ と識別。
    if (bgcolor !== "#ffffff" && staffName !== "佐藤") {
      staffNames.push(
        name2slackMention({
          name: staffName,
          slackInformation: LabCafeSlackInformation,
        })
      );
      // なのかは色ではなく"○"で識別。
    } else if (value === "○" && staffName === "佐藤") {
      nanoka = true;
    }
    // 営業責任者は、名前が書いてあるので抽出
    if (
      value &&
      LabCafeSlackInformation.find((e) => e.name === staffName) !== undefined
    ) {
      executive = name2slackMention(value);
      let idx = staffNames.indexOf(executive);
      if (idx != -1) staffNames.splice(idx, 1);
    }
  }

  // const sns_in_charge: string =
  //   staffNames[Math.floor(Math.random() * staffNames.length)];

  post2slack({
    webhookurl: SlackWebhookUrl,
    text: `【${today}(${dayOfweek})】
    営業時間　： *${business_hours}*
    営業責任者： ${executive}
    スタッフ　： ${staffNames.join("・")}
    ${
      nanoka
        ? `※ ${name2slackMention({
            name: "佐藤",
            slackInformation: LabCafeSlackInformation,
          })}も来られそう！！`
        : ""
    }
    `,
    channel: "#101-シフト_営業報告",
    // channel: "#973_times_shuto",
    // ストーリー： ${sns_in_charge}
    username: "Today's Staff",
  });
}
