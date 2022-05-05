import { SlackInfo, name2slackMention, post2slack } from "utils/slack_utils";
import { date2str, getDayOfWeek } from "utils/datetime_utils";

/** @global スプシ内の名前からslack内でのIDへの辞書 */
export const LabCafeSlackInformation: SlackInfo[] = [
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

export type LabCafeShiftInfo = {
  date_str: string;
  dayOfweek: string;
  business_hours: string;
  executive: string;
  staffNames: string[];
};

export function getShiftInformation({
  date,
  sheet,
}: {
  date: Date;
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
}): LabCafeShiftInfo | null {
  const date_str = date2str({ date: date, format: "MM/dd" });
  const dayOfweek: string = getDayOfWeek(date);

  /**
   * @note 一番上の列に日付が格納されている。
   * @summary 今日営業があるか。ある場合どの列にそのデータがあるか
   */
  const LastColumn: number = sheet.getLastColumn();
  var targetColumn = -1;
  for (let c = 1; c <= LastColumn; c++) {
    let date_cell = sheet.getRange(1, c).getValue();
    if (
      date_cell instanceof Date &&
      date_str == date2str({ date: date_cell, format: "MM/dd" })
    ) {
      targetColumn = c;
      break;
    }
  }
  if (targetColumn == -1) return null;

  /**
   * @note 営業時間は、二行目に格納されている。
   */
  const hoursRow: number = 2;
  const business_hours: string = sheet
    .getRange(hoursRow, targetColumn)
    .getValue();

  /**
   * @note 勤務に入るスタッフの背景色は "#ffffff" ではない。
   * @summary スタッフのIDを調べる。
   */
  var staffNames: string[] = [];
  var executive: string = "";
  const LastRow = sheet.getLastRow();
  const nameColumn = 1;
  for (let r = 3; r <= LastRow; r++) {
    let cell = sheet.getRange(r, targetColumn);
    let value = cell.getValue();
    let bgcolor = cell.getBackground();
    let staffName = sheet.getRange(r, nameColumn).getValue();
    // 白背景じゃない === 営業スタッフ と識別。
    if (
      (bgcolor !== "#ffffff" && staffName !== "佐藤") ||
      (value === "○" && staffName === "佐藤")
    ) {
      staffNames.push(
        name2slackMention({
          name: staffName,
          slackInformation: LabCafeSlackInformation,
        })
      );
    }
    // 営業責任者は、名前が書いてあるので抽出
    if (
      value &&
      LabCafeSlackInformation.find((e) => e.name === value) !== undefined
    ) {
      executive = name2slackMention({
        name: value,
        slackInformation: LabCafeSlackInformation,
      });
      let idx = staffNames.indexOf(executive);
      if (idx != -1) staffNames.splice(idx, 1);
    }
  }

  const ret: LabCafeShiftInfo = {
    date_str: date_str,
    dayOfweek: dayOfweek,
    business_hours: business_hours,
    executive: executive,
    staffNames: staffNames,
  };

  return ret;
}

export type LabCafeGuestInfo = {
  isNew: boolean;
  num: number;
  names: string;
  remarks: string;
};

export function LabCafeGuestInfo2string(info: LabCafeGuestInfo): string {
  return `${info.isNew ? "☆" : "　"}【 *${info.num}* 人】：${
    info.names
  }（ *備考* ：${info.remarks}）`;
}

export type LabCafeGuestsInfo = {
  date_str: string;
  dayOfweek: string;
  num_total_guests: number;
  num_total_new_guests: number;
  guests: LabCafeGuestInfo[];
};

export function getGuestInformation({
  date,
  sheet,
}: {
  date: Date;
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
}): LabCafeGuestsInfo | null {
  const date_str = date2str({ date: date, format: "MM/dd" });
  const dayOfweek: string = getDayOfWeek(date);

  /**
   * @note 一番上の列に日付が格納されている。
   * @summary シフトの情報があるか。ある場合どの列にそのデータがあるか
   */
  const LastColumn: number = sheet.getLastColumn();
  var targetColumn: number = -1;
  for (let c = 1; c <= LastColumn; c++) {
    let date_cell = sheet.getRange(1, c).getValue();
    if (
      date_cell instanceof Date &&
      date_str == date2str({ date: date_cell, format: "MM/dd" })
    ) {
      targetColumn = c;
      break;
    }
  }
  if (targetColumn == -1) return null;

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

  const num_total_new_guests: number = sheet
    .getRange(
      IdxRowTotalNumCounter,
      targetColumn - (2 - IdxColNumNewGuestsCounter)
    )
    .getValue();
  const num_total_guests: number = sheet
    .getRange(
      IdxRowTotalNumCounter,
      targetColumn - (2 - IdxColNumGuestsCounter)
    )
    .getValue();

  const LastRow: number = sheet.getLastRow();
  const data: any[][] = sheet
    .getRange(NRowsMeta + 1, targetColumn - 2, LastRow, NColsPerDay)
    .getValues();

  var guests_info: LabCafeGuestInfo[] = [];
  for (let r = 0; r <= LastRow; r++) {
    let row: any[] = data[r];
    if (row === null || row[IdxColNumGuestsCounter] === "") break;
    guests_info.push({
      isNew: row[IdxColNumNewGuestsCounter],
      num: row[IdxColNumGuestsCounter],
      names: row[IdxColGuestsName],
      remarks: row[IdxColGuestsRemarks],
    });
  }

  const ret: LabCafeGuestsInfo = {
    date_str: date_str,
    dayOfweek: dayOfweek,
    num_total_guests: num_total_guests,
    num_total_new_guests: num_total_new_guests,
    guests: guests_info,
  };

  return ret;
}
