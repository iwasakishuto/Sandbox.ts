// /**
//  * @file Formにつける
//  * @summary Google フォームの回答を集計して内容に応じてフォームの内容や状態を変更する。
//  * @author Shuto Iwasaki <cabernet.rock@gmail.com>
//  * @copyright Shuto Iwasaki 2021
//  * @license MIT
//  * @property {String} TARGET_SHEET_ID スプレッドシートのID (ex. "1dMqWKIwAC_6avFTyeac4nQafFDuvjlzeu-Dz7VnObTg")
//  * @property {String} WEBHOOK_URL Slack の Incoming Webhook の URL (ex. "https://hooks.slack.com/services/TXXXX/XXXXX/XXXX")
//  * @URL GoogleForm <https://docs.google.com/forms/d/1cS1n68VkvwbKXVNw0_dfRWP_48JJAvdPj-gvcDP_CJg>
//  *
//  *
//  * @Reference
//  * `getRange(row, column, numRows, numColumns)`
//  */

// const prop = PropertiesService.getScriptProperties();
// const form = FormApp.getActiveForm();
// const ss = SpreadsheetApp.openById(prop.getProperty("TARGET_SHEET_ID"));
// const WebhookURL = prop.getProperty("WEBHOOK_URL");

// /** @global 日付や時間の候補リスト */
// const Days = [
//   "１１月４日（木）",
//   "１１月５日（金）",
//   "１１月１１日（木）",
//   "１１月１２日（金）",
// ];
// const Times = [
//   "15:00-16:00",
//   "16:00-17:00",
//   "17:00-18:00",
//   "18:00-20:00 ※",
//   "20:00-22:00 ※",
// ];
// /** @global スプレッドシートのデータを代入するリスト */
// const [DATA_START_ROW, DATA_START_COL] = [5, 3];
// const UPPER_BOUND_ROW = 3;
// const CURRENT_TOTAL_ROW = 4;
// const DateItemIdx = 3; // 日付に関する質問は4番目から。

// /** @summary トリガーに設定する関数 */
// function main() {
//   /** @NOTE 最新の回答 === 今回の回答 */
//   const formResps = form.getResponses();
//   const curtFormResps = formResps[formResps.length - 1];
//   const itemResps = curtFormResps.getItemResponses();

//   /** @variable 参加者の名前を集計する */
//   const names = itemResps[0]
//     .getResponse()
//     .split("、")
//     .map((e) => e.trim())
//     .filter((e) => e.length > 0);

//   /** @variable 参加者の所属を集計する */
//   const attrs = itemResps[1]
//     .getResponse()
//     .split("、")
//     .map((e) => e.trim())
//     .filter((e) => e.length > 0);

//   /** @variable 参加希望日
//    * 各日にちごとにループを回す。
//    */
//   var text = "";
//   for (var q = 2; q < itemResps.length; q++) {
//     const itemResp = itemResps[q];
//     const dayIdx = itemResp.getItem().getIndex() - DateItemIdx;
//     const time = itemResps[q].getResponse().split(" (")[0];
//     const { ubs, curtTotals } = saveResps({
//       names: names,
//       time: time,
//       dayIdx: dayIdx,
//     });
//     const choices = updateForm({
//       ubs: ubs,
//       curtTotals: curtTotals,
//       dayIdx: dayIdx,
//     });
//     text += `*【${Days[dayIdx]} ${time}】*
//      → [現在の状況]
//      - ${choices.join("\n - ")}\n`;
//   }
//   postSlack({
//     text: `*新規のフォーム回答者です。*
//  名前：${names.join("・")}（${names.length}名）
//  所属：${attrs.join(" / ")}
//  ${text}`,
//   });
// }

// /**
//  * @summary フォームの回答をスプレッドシートに保存し、現在の参加者数を返す。
//  * @param {Array} names 参加者の名前
//  * @param {String} time 参加時間（フォームの選択肢の内容）
//  * @param {Number} dayIdx 参加日のindex
//  * @return {Object} {上限, 現在の参加者数}
//  */
// function saveResps({ names, time, dayIdx } = {}) {
//   const DAY_DATA_START_COL = DATA_START_COL + dayIdx * Times.length;
//   const sheet = ss.getSheetByName("集計");
//   const col = Times.indexOf(time);

//   /** @NOTE 上限の参加者数を取得 */
//   const ubs = sheet
//     .getRange(UPPER_BOUND_ROW, DAY_DATA_START_COL, 1, Times.length)
//     .getValues()[0];

//   /** @NOTE 現在（このフォームを含む）の参加者数を取得 */
//   const curtTotals = sheet
//     .getRange(CURRENT_TOTAL_ROW, DAY_DATA_START_COL, 1, Times.length)
//     .getValues()[0]
//     .map((e, i) => (i === col ? e + names.length : e));

//   // 今回のフォームの結果を記入
//   const sheetValues = sheet.getRange(`A${DATA_START_ROW}:A`).getValues();
//   const colValues = Array(Days.length * Times.length)
//     .fill()
//     .map((_, i) => (i === dayIdx * Times.length + col ? 1 : 0));
//   for (var i = 0; i < sheetValues.length; i++) {
//     var n = sheetValues[i][0];
//     if (n === undefined || n.length === 0) {
//       /** @NOTE データを作成 */
//       for (var j = 0; j < names.length; j++) {
//         sheet
//           .getRange(
//             DATA_START_ROW + i + j,
//             1,
//             1,
//             Days.length * Times.length + 2
//           )
//           .setValues([
//             [
//               names[j],
//               colValues.reduce((accumulator, e) => accumulator + e, 0),
//             ].concat(colValues),
//           ]);
//       }
//       break;
//     }
//   }

//   return {
//     ubs: ubs,
//     curtTotals: curtTotals,
//   };
// }

// /**
//  * @summary 現在の参加者数と各時間帯の上限からフォームの内容を更新する。
//  * @param {Array} ubs 上限の参加者数。
//  * @param {Array} time 現在の参加者数。
//  */
// function updateForm({ ubs, curtTotals, dayIdx } = {}) {
//   const choices = Times.map((e, i) => `${e} (${curtTotals[i]} / ${ubs[i]})`);
//   // const remainChoices = choices.filter((e, i) => curtTotals[i] < ubs[i]);
//   const remainChoices = Times.filter((e, i) => curtTotals[i] < ubs[i]);

//   form
//     .getItems()
//     [DateItemIdx + dayIdx].asMultipleChoiceItem()
//     .setChoiceValues(remainChoices)
//     .showOtherOption(false);
//   return choices;
// }

// /**
//  * @summary slackにテキストを送る。
//  * @param {string} text メッセージの内容。
//  * @param {string} channel 宛先のチャンネル名
//  * @param {string} username botの名前。
//  * @return {null} 何も返さない。
//  */
// function postSlack({
//   text,
//   channel = "#5_bar_collaboration_form",
//   username = "Form Response Reporter",
// } = {}) {
//   var response = UrlFetchApp.fetch(WebhookURL, {
//     method: "POST",
//     payload: JSON.stringify({
//       channel: channel,
//       username: username,
//       text: text, // メッセージの本文
//     }),
//   });
//   var content = response.getContentText("UTF-8");
// }
