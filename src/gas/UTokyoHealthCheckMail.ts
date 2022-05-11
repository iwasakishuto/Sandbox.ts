/**
 * @file 指定したメールアドレス宛に「健康管理報告」に似せたメールを送信する。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2022
 * @license MIT
 * @property RECIPIENT_MAIL_ADDRESS Recipient Mail Address.
 */

import { date2str } from "utils/datetime_utils";

declare const global: {
  [x: string]: unknown;
};

/** @global プロパティに保存されたデータ */
const prop: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();
const RECIPIENT_MAIL_ADDRESS: string = prop.getProperty(
  "RECIPIENT_MAIL_ADDRESS"
)!;

function main(): void {
  const today: Date = new Date();
  const today_str: string = date2str({ date: today, format: "yyyy/MM/dd" });

  const subject: string = `健康管理報告【入構 可】_${today_str}`;
  const body: string = `${today_str} 入構 可`;
  const htmlBody: string = HtmlService.createHtmlOutput(
    `
    <p>
      ※本メールは自動返信です。入構可の場合は守衛に以下を提示し、入構してください。<br />*This
      email is an automatic reply. If you are able to enter, please present=the
      following to the guard when you enter.<br />
      <br /><br />
      <span style="font-size: 20px">===</span><br />
      <span style="font-size: 65px"></span>
      <span style="font-size: 65px">${today_str}</span>
      <span style="font-size: 65px"></span><br />
      <span style="font-size: 65px">【入構 可】<br />[ENTRY OK]</span><br />
      <br /><br /><br />
      <span style="font-size: 20px"
        >健康管理情報の報告ありがとうございます。<br />Thank you for reporting the
        health management information.<br />===</span
      ><br />
    </p>
    `
  ).getContent();

  const ret: GoogleAppsScript.Gmail.GmailApp = GmailApp.sendEmail(
    RECIPIENT_MAIL_ADDRESS,
    subject,
    body,
    {
      name: "healthcheck.adm",
      htmlBody: htmlBody,
      // noReply: true,
    }
  );
}

global.main = main;
