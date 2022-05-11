// function getPresence() {
//   const P = PropertiesService.getScriptProperties();
//   var url = "https://slack.com/api/users.getPresence";

//   var payload = {
//     token: P.getProperty("SLACK_ACCESS_TOKEN"),
//     user: P.getProperty("SLACK_MEMBER_ID"),
//   };

//   var params = {
//     method: "GET",
//     contentType: "application/x-www-form-urlencoded",
//     payload: payload,
//   };

//   // HTTPリクエストを行う。
//   var res = UrlFetchApp.fetch(url, params);
//   var data = JSON.parse(res.getContentText());
//   return data;
// }

// function getNextRow() {
//   // Ref: https://blog.8basetech.com/google-apps-script/gas-lastrow-append/#crayon-5e383885136dd403891777
//   var ss = SpreadsheetApp.getActiveSpreadsheet();
//   var sheet = ss.getActiveSheet();
//   var lastRow = sheet.getLastRow();
//   return lastRow + 1;
// }

// function getNowDate() {
//   var date = new Date();
//   var str_date = Utilities.formatDate(
//     date,
//     "Asia/Tokyo",
//     "yyyy/MM/dd (E) HH:mm:ss"
//   );
//   return str_date;
// }

// function log2sheet() {
//   const presence2color = { active: "red", away: "blue" };

//   // シートに書き込む情報を取得。
//   var data = getPresence();
//   var presence = data["presence"];
//   var others = [data["online"], data["auto_away"], data["manual_away"]];
//   var row = getNextRow();
//   var date = getNowDate();

//   // シートを取得して書き込む。
//   var sheet = SpreadsheetApp.getActiveSheet();
//   sheet.getRange(row, 1).setValue(date); //日付・時間を一列目（A）
//   sheet.getRange(row, 2).setBackground(presence2color[presence]); // active/away は二列目(B)をカラーリング
//   for (var i = 0; i < others.length; i++) {
//     sheet.getRange(row, i + 3).setValue(others[i] ? "○" : "×"); // 残りの情報は、○/×で記録。
//   }
// }
