/**
 * @file A collection of functions useful for handling Slack.
 * @author Shuto Iwasaki <cabernet.rock@gmail.com>
 * @copyright Iwasaki Shuto 2022
 * @license MIT
 */

export type SlackInfo = {
  name: string;
  slackId: string;
};

/**
 * @summary Slackでメンションができるよう、名前を書き換える。
 * @param {string} name メンバーの名前
 * @return {string} slackのメンションに対応した形の名前。
 */
export function name2slackMention({
  name,
  slackInformation = [],
}: {
  name: string;
  slackInformation: SlackInfo[];
}): string {
  return `<@${slackInformation.find((e) => e.name === name)?.slackId}>`;
}

export function addSlackLink({
  text,
  link,
}: {
  text: string;
  link: string;
}): string {
  return `<${link}|${text}>`;
}

/**
 * @summary Slackにテキストメッセージを送る。
 * @param {string} text メッセージテキスト
 * @param {string} webhookurl Slack IncomingWebhook URL.
 * @param {string} channel 送信したいチャンネル名
 * @param {string} username 送信時に用いられるボット名
 */
export function post2slack({
  text,
  webhookurl,
  channel,
  username,
}: {
  text: string;
  webhookurl: string;
  channel?: string;
  username?: string;
}): string {
  let response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(
    webhookurl,
    {
      method: "post",
      payload: JSON.stringify({
        channel: channel,
        username: username,
        text: text, // メッセージの本文
      }),
    }
  );
  return response.getContentText("UTF-8");
}
