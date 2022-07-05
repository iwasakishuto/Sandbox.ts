function main() {
}/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/gas/lib/labcafe_utils.ts":
/*!**************************************!*\
  !*** ./src/gas/lib/labcafe_utils.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getGuestInformation = exports.LabCafeGuestInfo2string = exports.getShiftInformation = exports.LabCafeSlackInformation = void 0;
const slack_utils_1 = __webpack_require__(/*! utils/slack_utils */ "./src/utils/slack_utils.ts");
const datetime_utils_1 = __webpack_require__(/*! utils/datetime_utils */ "./src/utils/datetime_utils.ts");
/** @global スプシ内の名前からslack内でのIDへの辞書 */
exports.LabCafeSlackInformation = [
    { name: "石橋", slackId: "U03DQQ14F17" },
    { name: "大野", slackId: "U03E7RHTJHE" },
    { name: "南雲", slackId: "U03DENW1JKW" },
    // { name: "宮田", slackId: "UNA68UK7U" },
    // { name: "岡本", slackId: "US8GFHXMW" },
    { name: "紺野", slackId: "U03C3JW67RV" },
    { name: "河村（有）", slackId: "U038N75F0QG" },
    { name: "王", slackId: "U03D851GRGE" },
    { name: "安田", slackId: "U03D5FZT9QE" },
    { name: "新倉", slackId: "U03DC5LRW11" },
    { name: "宮下", slackId: "U03D5G07PSS" },
    { name: "岩崎", slackId: "U03DC7T4E4S" },
    { name: "吉田", slackId: "U038041DAAE" },
    { name: "佐藤（菜）", slackId: "U03D5G0GJQN" },
    { name: "佐藤（光）", slackId: "U03J714GT6Z" },
    { name: "Alvin", slackId: "U03DEJ6EEA0" },
    { name: "河村（若）", slackId: "U03CXH8HQBZ" },
    { name: "饗場", slackId: "U03CXH7Q99V" },
    // { name: "Instagram", slackId: "" },
];
function getShiftInformation({ date, sheet, }) {
    const date_str = (0, datetime_utils_1.date2str)({ date: date, format: "MM/dd" });
    const dayOfweek = (0, datetime_utils_1.getDayOfWeek)(date);
    /**
     * @note 一番上の列に日付が格納されている。
     * @summary 今日営業があるか。ある場合どの列にそのデータがあるか
     */
    const LastColumn = sheet.getLastColumn();
    var targetColumn = -1;
    for (let c = 1; c <= LastColumn; c++) {
        let date_cell = sheet.getRange(1, c).getValue();
        if (date_cell instanceof Date &&
            date_str == (0, datetime_utils_1.date2str)({ date: date_cell, format: "MM/dd" })) {
            targetColumn = c;
            break;
        }
    }
    if (targetColumn == -1)
        return null;
    /**
     * @note 営業時間は、二行目に格納されている。
     */
    const hoursRow = 2;
    const business_hours = sheet
        .getRange(hoursRow, targetColumn)
        .getValue();
    /**
     * @note 勤務に入るスタッフの背景色は "#ffffff" ではない。
     * @summary スタッフのIDを調べる。
     */
    var staffNames = [];
    var executive = "";
    const LastRow = sheet.getLastRow();
    const nameColumn = 1;
    for (let r = 3; r <= LastRow; r++) {
        let cell = sheet.getRange(r, targetColumn);
        let value = cell.getValue();
        let bgcolor = cell.getBackground();
        let staffName = sheet.getRange(r, nameColumn).getValue();
        // 白背景じゃない === 営業スタッフ と識別。
        if (bgcolor !== "#ffffff") {
            staffNames.push((0, slack_utils_1.name2slackMention)({
                name: staffName,
                slackInformation: exports.LabCafeSlackInformation,
            }));
        }
        // 営業責任者は、名前が書いてあるので抽出
        if (value &&
            exports.LabCafeSlackInformation.find((e) => e.name === value) !== undefined) {
            executive = (0, slack_utils_1.name2slackMention)({
                name: value,
                slackInformation: exports.LabCafeSlackInformation,
            });
            let idx = staffNames.indexOf(executive);
            if (idx != -1)
                staffNames.splice(idx, 1);
        }
    }
    const ret = {
        date_str: date_str,
        dayOfweek: dayOfweek,
        business_hours: business_hours,
        executive: executive,
        staffNames: staffNames,
    };
    return ret;
}
exports.getShiftInformation = getShiftInformation;
function LabCafeGuestInfo2string({ info, addRemarks = true, addInCharge = true, }) {
    return (`${info.isNew ? "☆" : "　"}【 *${info.num}* 人】：${info.names}` +
        (addRemarks ? `（ *備考* ：${info.remarks}）` : "") +
        (addInCharge
            ? (0, slack_utils_1.name2slackMention)({
                name: info.beInCharge,
                slackInformation: exports.LabCafeSlackInformation,
            })
            : ""));
}
exports.LabCafeGuestInfo2string = LabCafeGuestInfo2string;
function getGuestInformation({ date, sheet, }) {
    const date_str = (0, datetime_utils_1.date2str)({ date: date, format: "MM/dd" });
    const dayOfweek = (0, datetime_utils_1.getDayOfWeek)(date);
    /**
     * @note 一番上の列に日付が格納されている。
     * @summary シフトの情報があるか。ある場合どの列にそのデータがあるか
     */
    const LastColumn = sheet.getLastColumn();
    var targetColumn = -1;
    for (let c = 1; c <= LastColumn; c++) {
        let date_cell = sheet.getRange(1, c).getValue();
        if (date_cell instanceof Date &&
            date_str == (0, datetime_utils_1.date2str)({ date: date_cell, format: "MM/dd" })) {
            targetColumn = c;
            break;
        }
    }
    if (targetColumn == -1)
        return null;
    /**
     * @note
     */
    const NColsPerDay = 6;
    const NRowsMeta = 2;
    const IdxRowTotalNumCounter = 1;
    const IdxColNumGuestsCounter = 0;
    const IdxColNumNewGuestsCounter = 1;
    const IdxColGuestsName = 2;
    const IdxColGuestInCharge = 3;
    const IdxColGuestsRemarks = 4;
    const num_total_new_guests = sheet
        .getRange(IdxRowTotalNumCounter, targetColumn - (2 - IdxColNumNewGuestsCounter))
        .getValue();
    const num_total_guests = sheet
        .getRange(IdxRowTotalNumCounter, targetColumn - (2 - IdxColNumGuestsCounter))
        .getValue();
    const event = sheet
        .getRange(IdxRowTotalNumCounter, targetColumn + 2)
        .getValue();
    const LastRow = sheet.getLastRow();
    const data = sheet
        .getRange(NRowsMeta + 1, targetColumn - 2, LastRow, NColsPerDay)
        .getValues();
    var guests_info = [];
    for (let r = 0; r <= LastRow; r++) {
        let row = data[r];
        if (row === null || row[IdxColNumGuestsCounter] === "")
            break;
        guests_info.push({
            isNew: row[IdxColNumNewGuestsCounter],
            num: row[IdxColNumGuestsCounter],
            names: row[IdxColGuestsName],
            remarks: row[IdxColGuestsRemarks],
            beInCharge: row[IdxColGuestInCharge],
        });
    }
    const ret = {
        date_str: date_str,
        dayOfweek: dayOfweek,
        event: event,
        num_total_guests: num_total_guests,
        num_total_new_guests: num_total_new_guests,
        guests: guests_info,
    };
    return ret;
}
exports.getGuestInformation = getGuestInformation;


/***/ }),

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


/**
 * @file A collection of functions useful for handling Slack.
 * @author Shuto Iwasaki <cabernet.rock@gmail.com>
 * @copyright Iwasaki Shuto 2022
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.post2slack = exports.addSlackLink = exports.name2slackMention = void 0;
/**
 * @summary Slackでメンションができるよう、名前を書き換える。
 * @param {string} name メンバーの名前
 * @return {string} slackのメンションに対応した形の名前。
 */
function name2slackMention({ name, slackInformation = [], }) {
    var _a;
    let slackId = (_a = slackInformation.find((e) => e.name === name)) === null || _a === void 0 ? void 0 : _a.slackId;
    if (slackId === undefined) {
        return name;
    }
    else {
        return `<@${slackId}>`;
    }
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
  !*** ./src/gas/LabCafe-shift.ts ***!
  \**********************************/

/**
 * @file スプシに書かれている情報を元に、slackで勤務者をメンションする。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2022
 * @license MIT
 * @property ID_SPREAD_SHEET_SHIFT: ID for Shift Spread Sheet.
 * @property ID_SPREAD_SHEET_GUEST: ID for Guest Spread Sheet.
 * @property SLACK_WEBHOOK_URL: URL for Slack Incoming Webhook.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const labcafe_utils_1 = __webpack_require__(/*! gas/lib/labcafe_utils */ "./src/gas/lib/labcafe_utils.ts");
const datetime_utils_1 = __webpack_require__(/*! utils/datetime_utils */ "./src/utils/datetime_utils.ts");
const slack_utils_1 = __webpack_require__(/*! utils/slack_utils */ "./src/utils/slack_utils.ts");
/** @global プロパティに保存されたデータ */
const prop = PropertiesService.getScriptProperties();
const SSID_SHIFT = prop.getProperty("ID_SPREAD_SHEET_SHIFT");
const SSID_GUEST = prop.getProperty("ID_SPREAD_SHEET_GUEST");
const SlackWebhookUrl = prop.getProperty("SLACK_WEBHOOK_URL");
/** @summary スケジューラーに登録するメイン関数 */
function main() {
    var text = "";
    const today = new Date();
    const sheet_name = (0, datetime_utils_1.date2str)({ date: today, format: "yyyy-MM" });
    // Get Shift Information.
    const ShiftSheet = SpreadsheetApp.openById(SSID_SHIFT).getSheetByName(sheet_name);
    const shiftInfo = (0, labcafe_utils_1.getShiftInformation)({
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
    const GuestSheet = SpreadsheetApp.openById(SSID_GUEST).getSheetByName(sheet_name);
    const guestsInfo = (0, labcafe_utils_1.getGuestInformation)({
        date: today,
        sheet: GuestSheet,
    });
    if (guestsInfo != null) {
        text += `*【ゲスト】*
人数　： *${guestsInfo.num_total_guests}*
初来店： *${guestsInfo.num_total_new_guests}*
-------------------
${guestsInfo.guests
            .map((info) => (0, labcafe_utils_1.LabCafeGuestInfo2string)({ info: info }))
            .join("\n")}`;
    }
    // guestsInfo
    (0, slack_utils_1.post2slack)({
        webhookurl: SlackWebhookUrl,
        text: text,
        channel: "#101-シフト_営業報告",
        // channel: "#973_times_shuto",
        username: "Today's Staff",
    });
}
__webpack_require__.g.main = main;

})();

/******/ })()
;