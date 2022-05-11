// /**
//  * @OnlyCurrentDoc
//  */

// import {
//   GoogleCalendarEvent,
//   calendarEvents2Text,
//   createCalendarEvent,
//   listUpCalendarEvent,
// } from "gas/lib/google_calendar";

// import { post2slack } from "utils/slack_utils";

// declare const global: {
//   [x: string]: unknown;
// };

// function add2Calendar(slack_id, eventname, start, end) {
//   const P = PropertiesService.getScriptProperties();
//   const place = P.getProperty("ADDRESS");
//   const slackID2calendar = {
//     "<@UFYARKHKN>": P.getProperty("SHUTO_CALENDAR"),
//     "<@UFXT7J38R>": P.getProperty("DAISUKE_CALENDAR"),
//     "<@UFXPA7XA4>": P.getProperty("NAOTO_CALENDAR"),
//     "<@UHMLU9B62>": P.getProperty("DATSUKAN_CALENDAR"),
//   };
//   if (slack_id == "<@UFYARKHKN>") {
//     const calendar = CalendarApp.getCalendarById(slackID2calendar[slack_id]);
//     calendar.createEvent(eventname, start, end, { location: place });
//   }
// }

// function add2Calendar_HangOut(slack_id) {
//   const eventname = "洗濯物を干す";
//   var date = new Date();
//   date.setDate(date.getDate() + 1);
//   var today = Utilities.formatDate(date, "JST", "yyyy/MM/dd");
//   const eventtime = new Date(today + " 08:00:00");
//   add2Calendar(slack_id, eventname, eventtime, eventtime);
// }

// function add2Calendar_TakeIn(slack_id) {
//   const eventname = "洗濯物の取り込み";
//   var date = new Date();
//   var today = Utilities.formatDate(date, "JST", "yyyy/MM/dd");
//   const eventtime = new Date(today + " 23:00:00");
//   add2Calendar(slack_id, eventname, eventtime, eventtime);
// }

// // Return weather information as strings.
// function getWeatherData() {
//   // データ取得
//   var url =
//     "https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=130000";
//   // var url = "http://www.jma.go.jp/jp/yoho/319.html"; // 東京の天気
//   var response = UrlFetchApp.fetch(url); // URL から html
//   var data = response.getContentText();

//   // 大雑把に分割＆配列化
//   var ary = data.split('<th class="weather">')[2];

//   // 朝6時から24時までの降水確率
//   var ary_pop = ary.split("%"); // Probability Of Precipitation
//   var ary_rainy = [];
//   for (var i in ary_pop) {
//     var pop = ary_pop[i].substr(-2);
//     if (pop == ">0") pop = "0";
//     ary_rainy.push(pop + "%");
//   }
//   var str_pop =
//     "00-06：" +
//     ary_rainy[0] +
//     "\n06-12：" +
//     ary_rainy[1] +
//     "\n12-18：" +
//     ary_rainy[2] +
//     "\n18-24：" +
//     ary_rainy[3];

//   // 最低最高気温
//   var min = ary
//     .split("min")[1]
//     .match(/>(.+?)</g)[0]
//     .slice(1, -1);
//   // 記録がない場合は「---」に置き換える
//   if (min == "</t") min = "---";
//   var max = ary
//     .split("max")[1]
//     .match(/>(.+?)</g)[0]
//     .slice(1, -1);
//   if (max == "</t") max = "---";
//   var str_temp = "朝の最低気温　：" + min + "\n日中の最高気温：" + max;

//   // 天気を言葉で取得
//   var weather = ary.match(/title="(.+?)"/g)[0].slice(7, -1);

//   // 天気の画像取得
//   var img = ary.match(/src="(.*?)"/g)[0].slice(5, -1);
//   var img_url = "http://www.jma.go.jp/jp/yoho/" + img;

//   var weather_str =
//     "*" +
//     weather +
//     "*\n" +
//     img_url +
//     "\n`【降水確率】`\n" +
//     str_pop +
//     "\n`【気温】`\n" +
//     str_temp +
//     "\n";
//   return weather_str;
// }

// // Return Day of Week as strings.
// function getDayOfWeek(date) {
//   var dayOfWeek = date.getDay();
//   var dayOfWeekStr = ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek];
//   return dayOfWeekStr;
// }

// // Return Day of Today as "MM月dd日(youbi)"
// function getDayOfToday() {
//   // 明日の日付取得
//   var date = new Date(); // 今日の日付
//   var today = Utilities.formatDate(date, "Asia/Tokyo", "MM月dd日");
//   var youbi = getDayOfWeek(date);
//   var str_date = today + "(" + youbi + ")";
//   return str_date;
// }

// // Return Day of Tomorrow as "MM月dd日(youbi)"
// function getDayOfTomorrow() {
//   // 明日の日付取得
//   var date = new Date(); // 今日の日付
//   date.setDate(date.getDate() + 1); // 明日の日付
//   var today = Utilities.formatDate(date, "Asia/Tokyo", "MM月dd日");
//   var youbi = getDayOfWeek(date);
//   var str_date = today + "(" + youbi + ")";
//   return str_date;
// }

// // Loggin to Who hangs out the laundry.
// function log2sheet(Names, name1, name2) {
//   var start = Moment.moment("2020/1/1");
//   var now = Moment.moment();
//   var row = now.diff(start, "days") + 5;
//   const Name2col = {
//     修登: 2,
//     大介: 3,
//     尚人: 4,
//     だつかん: 5,
//   };
//   var sheet = SpreadsheetApp.getActiveSheet();
//   for (var i = 0; i < Names.length; i++) {
//     cell = sheet.getRange(row, Name2col[Names[i]]);
//     cell.setBackground("#FFF1CF");
//   }
//   // 役割
//   sheet.getRange(row, Name2col[name1]).setValue("○");
//   sheet.getRange(row, Name2col[name2]).setValue("○");
// }

// // post to Slack.
// function postSlack(payload) {
//   var options = {
//     method: "POST",
//     contentType: "application/json",
//     payload: JSON.stringify(payload),
//   };

//   var url = PropertiesService.getScriptProperties().getProperty(
//     "INCOMING_WEBHOOKS_URL"
//   );
//   var response = UrlFetchApp.fetch(url, options);
//   var content = response.getContentText("UTF-8");
// }

// // 決められた人数を選択
// function assignMembers(n, is2log) {
//   const Name2Id = {
//     修登: "<@UFYARKHKN>",
//     大介: "<@UFXT7J38R>",
//     尚人: "<@UFXPA7XA4>",
//     だつかん: "<@UHMLU9B62>",
//   };
//   const sheet = SpreadsheetApp.getActiveSheet();

//   var Names = [];
//   var ret = [];
//   for (var i = 0; i < Object.keys(Name2Id).length; i++) {
//     if (sheet.getRange(2, i + 2).getValue() == "○") {
//       Names.push(sheet.getRange(1, i + 2).getValue());
//     }
//   }
//   var num_able_members = Names.length;
//   if (n == 1 || num_able_members == 1) {
//     var index = Math.floor(Math.random() * num_able_members);
//     var name = Names[index];
//     var slack_id = Name2Id[name];
//     if (is2log) {
//       log2sheet(Names, name, name);
//     }
//     ret.push(slack_id);
//   } else if (n == 2) {
//     var index = Math.floor(Math.random() * num_able_members);
//     var index2 = Math.floor(Math.random() * num_able_members);
//     while (index === index2) {
//       index2 = Math.floor(Math.random() * num_able_members);
//     }
//     var name = Names[index];
//     var name2 = Names[index2];
//     var slack_id = Name2Id[name];
//     var slack_id2 = Name2Id[name2];
//     if (is2log) {
//       log2sheet(Names, name, name2);
//     }
//     ret.push(slack_id);
//     ret.push(slack_id2);
//   } else {
//     //
//     Logger.logs("Error Occured in `assignMembers`.");
//   }
//   return ret;
// }

// // 洗濯物を干す人を決定。
// function main1() {
//   ret = assignMembers(1, true);
//   slack_id1 = ret[0];
//   add2Calendar_HangOut(slack_id1);
//   // slack_id2 = ret[1];

//   var str_date = getDayOfTomorrow();
//   var weather_str = getWeatherData();
//   // message = "明日の朝 *洗濯物を干す* のは + ...
//   var message =
//     "明日の *洗濯物の当番* は" +
//     slack_id1 +
//     "お願いします。\n明日 " +
//     str_date +
//     " の天気： " +
//     weather_str;

//   var payload = {
//     text: message,
//     channel: "#laundry",
//     username: "文乃（秘書）",
//     icon_url:
//       "https://i.pinimg.com/originals/48/42/08/484208545200440b11c9973382997dab.jpg",
//   };
//   postSlack(payload);
// }

// // 洗濯物を取り込む人を決定。
// function main2() {
//   ret = assignMembers(1, false);
//   slack_id1 = ret[0];
//   // slack_id2 = ret[1];
//   add2Calendar_TakeIn(slack_id1);

//   var str_date = getDayOfToday();
//   var weather_str = getWeatherData();
//   var message =
//     "今日の *洗濯物の取り込み* は" +
//     slack_id1 +
//     "お願いね！！\n今日 " +
//     str_date +
//     " の天気： " +
//     weather_str;

//   var payload = {
//     text: message,
//     channel: "#laundry",
//     username: "みくりさん",
//     icon_url:
//       "https://pbs.twimg.com/profile_images/804164014473289728/OCNtA0UO_400x400.jpg", // アイコン画像
//   };
//   postSlack(payload);
// }

// // 木村文乃（秘書）
// function doPost(e) {
//   const P = PropertiesService.getScriptProperties();
//   const slack_token = P.getProperty("SLACK_ACCESS_TOKEN");
//   const outgoing_url = P.getProperty("OUTGOING_WEBHOOKS_TOKEN");
//   const Id2col = { UFYARKHKN: 2, UFXT7J38R: 3, UFXPA7XA4: 4, UHMLU9B62: 5 };
//   const Names = ["*修登*, ", "*大介*, ", "*尚人*, ", "*だつかん*, "];

//   const sheet = SpreadsheetApp.getActiveSheet();
//   const col = Id2col[e.parameter.user_id];

//   var message = "";
//   var text = e.parameter.text;
//   if (text.match(/add/)) {
//     sheet.getRange(2, col).setValue("○");
//     message += "<@" + e.parameter.user_id + "> を候補に追加しました。";
//   } else if (text.match(/remove/)) {
//     sheet.getRange(2, col).setValue("×");
//     message += "<@" + e.parameter.user_id + "> を候補から外しました。";
//   } else if (text.match(/now/)) {
//     message += "現在は ";
//     for (var i = 0; i < Names.length; i++) {
//       if (sheet.getRange(2, i + 2).getValue() == "○") {
//         message += Names[i];
//       }
//     }
//     message += "が候補に入っています。";
//   } else if (text.match(/apologize to .*?/i)) {
//     var name = fetchData_maximum(text, "apologize to ", "");
//     if (text.match(/me/)) {
//       name = "<@" + e.parameter.user_id + ">";
//     }
//     message += name + "、たくさん指名しちゃってゴメンね、、、";
//   } else {
//     message += "`add` `remove` `now` のどれかで選んでください！！";
//   }
//   var chid = e.parameter.channel_id;
//   var payload = {
//     text: message,
//     channel: chid,
//     username: "文乃（秘書）",
//     icon_url:
//       "https://i.pinimg.com/originals/48/42/08/484208545200440b11c9973382997dab.jpg",
//   };
//   postSlack(payload);
// }

// function fetchData(str, pre, inf, suf) {
//   var reg = new RegExp(pre + inf + suf, "i");
//   var data = str.match(reg)[0].replace(pre, "").replace(suf, "");
//   return data;
// }

// function fetchData_maximum(str, pre, suf) {
//   return fetchData(str, pre, ".*", suf);
// }

// function fetchData_minimum(str, pre, suf) {
//   return fetchData(str, pre, ".*?", suf);
// }

// function say_something(message) {
//   var payload = {
//     text: message,
//     channel: "#laundry",
//     username: "みくりさん",
//     icon_url:
//       "https://pbs.twimg.com/profile_images/804164014473289728/OCNtA0UO_400x400.jpg", // アイコン画像
//   };
//   postSlack(payload);
// }

// global.main = main1;
