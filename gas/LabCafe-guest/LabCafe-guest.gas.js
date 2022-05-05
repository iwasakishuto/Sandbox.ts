function main() {
}/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/datetime_utils.ts":
/*!*************************************!*\
  !*** ./src/utils/datetime_utils.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getDaysAgo = exports.getDayOfWeek = exports.date2str = void 0;
/**
 * @summary Convert Date object to date string.
 * @param {Date} date Date object.
 * @param {string} timeZone A time zone.
 * @param {string} format Date format
 * @return {string} 日付（MM/dd）
 */
function date2str({ date, timeZone = "Asia/Tokyo", format = "yyyy-MM-dd HH:mm:ss", }) {
    return Utilities.formatDate(date, timeZone, format);
}
exports.date2str = date2str;
/**
 * @summary Dateオブジェクトから曜日を取得する。
 * @param {Date} date Dateオブジェクト。
 * @return {string} 曜日
 */
function getDayOfWeek(date) {
    return ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
}
exports.getDayOfWeek = getDayOfWeek;
/**
 * @summary 今日から指定した日にち前のDateオブジェクトを取得する。
 * @param {number} day 何日前か。
 * @return {Date} Dateオブジェクト
 */
function getDaysAgo(day) {
    var date = new Date();
    date.setDate(date.getDate() - day);
    return date;
}
exports.getDaysAgo = getDaysAgo;


/***/ }),

/***/ "./src/utils/slack_utils.ts":
/*!**********************************!*\
  !*** ./src/utils/slack_utils.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.post2slack = exports.addSlackLink = exports.name2slackMention = void 0;
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
function addSlackLink({ text, link, }) {
    return `<${link}|${text}>`;
}
exports.addSlackLink = addSlackLink;
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************************!*\
  !*** ./src/gas/LabCafe-guest.ts ***!
  \**********************************/

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
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
const SSLINK_SHIFT = prop.getProperty("LINK_SPREAD_SHEET_SHIFT");
const SlackWebhookUrl = prop.getProperty("SLACK_WEBHOOK_URL");
/** @summary スケジューラーに登録するメイン関数 */
function main() {
    const targetDay = (0, datetime_utils_1.getDaysAgo)(-7);
    const targetDay_str = (0, datetime_utils_1.date2str)({ date: targetDay, format: "MM/dd" });
    const targetDayOfweek = (0, datetime_utils_1.getDayOfWeek)(targetDay);
    const sheet_name = (0, datetime_utils_1.date2str)({ date: targetDay, format: "yyyyMM" });
    const GuestSheet = SpreadsheetApp.openById(SSID_GUEST).getSheetByName(sheet_name);
    /**
     * @note 一番上の列に日付が格納されている。
     * @summary 今日営業があるか。ある場合どの列にそのデータがあるか
     */
    const LastColumn = GuestSheet.getLastColumn();
    var targetColumn = -1;
    for (let c = 1; c <= LastColumn; c++) {
        let date_cell = GuestSheet.getRange(1, c).getValue();
        if (date_cell instanceof Date &&
            targetDay_str == (0, datetime_utils_1.date2str)({ date: date_cell, format: "MM/dd" })) {
            targetColumn = c;
            break;
        }
    }
    if (targetColumn == -1)
        return;
    /**
     * @note
     */
    const NColsPerDay = 5;
    const NRowsMeta = 2;
    const IdxRowTotalNumCounter = 1;
    const IdxColNumGuestsCounter = 0;
    const IdxColNumNewGuestsCounter = 1;
    const IdxColGuestsName = 2;
    const IdxColGuestsInvitees = 3;
    const IdxColGuestsRemarks = 4;
    const num_total_new_guests = GuestSheet.getRange(IdxRowTotalNumCounter, targetColumn - (2 - IdxColNumGuestsCounter)).getValue();
    const num_total_guests = GuestSheet.getRange(IdxRowTotalNumCounter, targetColumn - (2 - IdxColNumNewGuestsCounter)).getValue();
    const LastRow = GuestSheet.getLastRow();
    const data = GuestSheet.getRange(NRowsMeta + 1, targetColumn - 2, LastRow, NColsPerDay).getValues();
    var guests_info = [];
    for (let r = 0; r <= LastRow; r++) {
        let row = data[r];
        if (row === null || row[IdxColNumGuestsCounter] === "")
            break;
        guests_info.push(`${row[IdxColNumNewGuestsCounter] ? "☆" : "　"}【 *${row[IdxColNumGuestsCounter]}* 人】：${row[IdxColGuestsName]}（ *備考* ：${row[IdxColGuestsRemarks]}）`);
    }
    // const sns_in_charge: string =
    //   staffNames[Math.floor(Math.random() * staffNames.length)];
    (0, slack_utils_1.post2slack)({
        webhookurl: SlackWebhookUrl,
        text: `ゲスト人数： *${num_total_guests}*
初来店の方： *${num_total_new_guests}*
-------------------
${guests_info.join("\n")}
-------------------
※ 当日のシフトは ${(0, slack_utils_1.addSlackLink)({
            text: "ここ",
            link: SSLINK_SHIFT,
        })} を参照。
`,
        channel: "#102-ゲスト",
        // channel: "#973_times_shuto",
        // ストーリー： ${sns_in_charge}
        username: `${targetDay_str}(${targetDayOfweek})のゲスト`,
    });
}
__webpack_require__.g.main = main;

})();

/******/ })()
;