/**
 * @summary Dateオブジェクトから日付を取得する
 * @param {Date} date Dateオブジェクト。
 * @return {string} 日付（MM/dd）
 */
export function toMMdd(date: Date): string {
  return Utilities.formatDate(date, "Asia/Tokyo", "MM/dd");
}

/**
 * @summary Dateオブジェクトから曜日を取得する。
 * @param {Date} date Dateオブジェクト。
 * @return {string} 曜日
 */
export function getDayOfWeek(date: Date): string {
  return ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];
}
