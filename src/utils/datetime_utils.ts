/**
 * @summary Convert Date object to date string.
 * @param {Date} date Date object.
 * @param {string} timeZone A time zone.
 * @param {string} format Date format
 * @return {string} 日付（MM/dd）
 */
export function date2str({
  date,
  timeZone = "Asia/Tokyo",
  format = "yyyy-MM-dd HH:mm:ss",
}: {
  date: Date | GoogleAppsScript.Base.Date;
  timeZone?: string;
  format?: string;
}): string {
  return Utilities.formatDate(date, timeZone, format);
}

/**
 * @summary Dateオブジェクトから曜日を取得する。
 * @param {Date} date Dateオブジェクト。
 * @return {string} 曜日
 */
export function getDayOfWeek(date: Date): string {
  return ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
}

/**
 * @summary 今日から指定した日にち前のDateオブジェクトを取得する。
 * @param {number} day 何日前か。
 * @return {Date} Dateオブジェクト
 */
export function getDaysAgo(day: number): Date {
  var date: Date = new Date();
  date.setDate(date.getDate() - day);
  return date;
}
