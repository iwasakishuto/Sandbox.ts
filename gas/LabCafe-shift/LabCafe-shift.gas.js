/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/datetime_utils.ts":
/*!*************************************!*\
  !*** ./src/utils/datetime_utils.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDayOfWeek = exports.toMMdd = void 0;
/**
 * @summary Dateオブジェクトから日付を取得する
 * @param {Date} date Dateオブジェクト。
 * @return {string} 日付（MM/dd）
 */
function toMMdd(date) {
    return Utilities.formatDate(date, "Asia/Tokyo", "MM/dd");
}
exports.toMMdd = toMMdd;
/**
 * @summary Dateオブジェクトから曜日を取得する。
 * @param {Date} date Dateオブジェクト。
 * @return {string} 曜日
 */
function getDayOfWeek(date) {
    return ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
}
exports.getDayOfWeek = getDayOfWeek;


/***/ }),

/***/ "./src/utils/slack_utils.ts":
/*!**********************************!*\
  !*** ./src/utils/slack_utils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.post2slack = exports.name2slackMention = void 0;
/**
 * @summary Slackでメンションができるよう、名前を書き換える。
 * @param {string} name メンバーの名前
 * @return {string} slackのメンションに対応した形の名前。
 */
function name2slackMention({ name, slackInformation = [], }) {
    var _a;
    return `<@${(_a = slackInformation.find((e) => e.name === name)) === null || _a === void 0 ? void 0 : _a.slackId}>`;
}
exports.name2slackMention = name2slackMention;
/**
 * @summary Slackにテキストメッセージを送る。
 * @param {string} text メッセージテキスト
 * @param {string} webhookurl Slack IncomingWebhook URL.
 * @param {string} channel 送信したいチャンネル名
 * @param {string} username 送信時に用いられるボット名
 */
function post2slack({ text, webhookurl, channel, username, }) {
    let response = UrlFetchApp.fetch(webhookurl, {
        method: "post",
        payload: JSON.stringify({
            channel: channel,
            username: username,
            text: text, // メッセージの本文
        }),
    });
    return response.getContentText("UTF-8");
}
exports.post2slack = post2slack;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************************!*\
  !*** ./src/gas/LabCafe-shift.ts ***!
  \**********************************/

/**
 * @file スプシに書かれている情報を元に、slackで勤務者をメンションする。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2021
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getTargetSheetName = void 0;
const slack_utils_1 = __webpack_require__(/*! utils/slack_utils */ "./src/utils/slack_utils.ts");
const datetime_utils_1 = __webpack_require__(/*! utils/datetime_utils */ "./src/utils/datetime_utils.ts");
/** @global スプシ内の名前からslack内でのIDへの辞書 */
const LabCafeSlackInformation = [
    { name: "石橋", slackId: "U03DQQ14F17" },
    { name: "大野", slackId: "U03E7RHTJHE" },
    { name: "南雲", slackId: "U03DENW1JKW" },
    // { name: "宮田", slackId: "UNA68UK7U" },
    // { name: "岡本", slackId: "US8GFHXMW" },
    { name: "紺野", slackId: "U03C3JW67RV" },
    { name: "河村", slackId: "U038N75F0QG" },
    { name: "王", slackId: "U03D851GRGE" },
    { name: "安田", slackId: "U03D5FZT9QE" },
    { name: "新倉", slackId: "U03DC5LRW11" },
    { name: "宮下", slackId: "U03D5G07PSS" },
    { name: "岩崎", slackId: "U03DC7T4E4S" },
    { name: "吉田", slackId: "U038041DAAE" },
    { name: "佐藤", slackId: "U03D5G0GJQN" },
];
/** @global プロパティに保存されたデータ */
const prop = PropertiesService.getScriptProperties();
const SSID_SHIFT = prop.getProperty("ID_SPREAD_SHEET_SHIFT");
const SSID_GUEST = prop.getProperty("ID_SPREAD_SHEET_GUEST");
const SlackWebhookUrl = prop.getProperty("WEBHOOK_URL");
/**
 * @summary Dateオブジェクトからその日に参照すべきスプレッドシートの名前取得する。
 * @param {Date} date Dateオブジェクト。
 * @return {string} 月名（MM月）
 */
function getTargetSheetName(date) {
    var month = Number(date.getMonth() + 1);
    var day = Number(date.getDate());
    if (day > 25) {
        month = month == 12 ? 1 : month + 1;
    }
    return `${Number(month)}月`;
    // return `${("0" + month).slice(-2)}月`;
}
exports.getTargetSheetName = getTargetSheetName;
/** @summary スケジューラーに登録するメイン関数 */
function main() {
    const date = new Date();
    const today = (0, datetime_utils_1.toMMdd)(date);
    const dayOfweek = (0, datetime_utils_1.getDayOfWeek)(date);
    const sheet_name = getTargetSheetName(date);
    const TargetSheet = SpreadsheetApp.openById(SSID_SHIFT).getSheetByName(sheet_name);
    /**
     * @note 一番上の列に日付が格納されている。
     * @summary 今日営業があるか。ある場合どの列にそのデータがあるか
     */
    const LastColumn = TargetSheet.getLastColumn();
    var targetColumn = -1;
    for (let c = 1; c <= LastColumn; c++) {
        let date_cell = TargetSheet.getRange(1, c).getValue();
        if (date_cell instanceof Date && today == (0, datetime_utils_1.toMMdd)(date_cell)) {
            targetColumn = c;
            break;
        }
    }
    if (targetColumn == -1)
        return;
    /**
     * @note 営業時間は、二行目に格納されている。
     */
    const hoursRow = 2;
    const business_hours = TargetSheet.getRange(hoursRow, targetColumn).getValue();
    /**
     * @note 勤務に入るスタッフの背景色は "#ffffff" ではない。
     * @summary スタッフのIDを調べる。
     */
    var staffNames = [];
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
            staffNames.push((0, slack_utils_1.name2slackMention)({
                name: staffName,
                slackInformation: LabCafeSlackInformation,
            }));
            // なのかは色ではなく"○"で識別。
        }
        else if (value === "○" && staffName === "佐藤") {
            nanoka = true;
        }
        // 営業責任者は、名前が書いてあるので抽出
        if (value &&
            LabCafeSlackInformation.find((e) => e.name === staffName) !== undefined) {
            executive = (0, slack_utils_1.name2slackMention)(value);
            let idx = staffNames.indexOf(executive);
            if (idx != -1)
                staffNames.splice(idx, 1);
        }
    }
    // const sns_in_charge: string =
    //   staffNames[Math.floor(Math.random() * staffNames.length)];
    (0, slack_utils_1.post2slack)({
        webhookurl: SlackWebhookUrl,
        text: `【${today}(${dayOfweek})】
    営業時間　： *${business_hours}*
    営業責任者： ${executive}
    スタッフ　： ${staffNames.join("・")}
    ${nanoka
            ? `※ ${(0, slack_utils_1.name2slackMention)({
                name: "佐藤",
                slackInformation: LabCafeSlackInformation,
            })}も来られそう！！`
            : ""}
    `,
        channel: "#101-シフト_営業報告",
        // channel: "#973_times_shuto",
        // ストーリー： ${sns_in_charge}
        username: "Today's Staff",
    });
}

})();

/******/ })()
;