/**
 * @file トレロの内容をslackに通知する。
 * @author Shuto Iwasaki <https://github.com/iwasakishuto>
 * @copyright Shuto Iwasaki 2022
 * @license MIT
 * @property TRELLO_BOARDID: Trello Board Id.
 * @property TRELLO_APIKEY: Trello API Key.
 * @property TRELLO_TOKEN: Trello Token.
 * @property SLACK_WEBHOOK_URL: URL for Slack Incoming Webhook.
 */

import { getTrelloTasks } from "utils/trello_utils";
import { post2slack } from "utils/slack_utils";

declare const global: {
  [x: string]: unknown;
};

const prop: GoogleAppsScript.Properties.Properties =
  PropertiesService.getScriptProperties();
const TRELLO_BOARDID: string = prop.getProperty("TRELLO_BOARDID")!;
const TRELLO_APIKEY: string = prop.getProperty("TRELLO_APIKEY")!;
const TRELLO_TOKEN: string = prop.getProperty("TRELLO_TOKEN")!;
const SlackWebhookUrl: string = prop.getProperty("SLACK_WEBHOOK_URL")!;

const TRELLO_SKIP_BOARD_LISTS: string[] = ["Trash"];

function main() {
  const trello_tasks: Map<string, string[]> = getTrelloTasks({
    board_id: TRELLO_BOARDID,
    api_key: TRELLO_APIKEY,
    token: TRELLO_TOKEN,
  });
  const text: string = trelloTasks2message({
    tasks: trello_tasks,
    skip_board_lists: TRELLO_SKIP_BOARD_LISTS,
  });
  post2slack({
    text: text,
    webhookurl: SlackWebhookUrl,
    channel: "",
    username: "",
  });
}

function trelloTasks2message({
  name = "",
  tasks,
  skip_board_lists,
}: {
  name?: string;
  tasks: Map<string, string[]>;
  skip_board_lists: string[];
}): string {
  var text: string = "";
  var num_tasks: number = 0;
  Object.entries(tasks).forEach((e) => {
    const [board_name, cards_list] = e;
    if (!skip_board_lists.includes(board_name)) {
      text +=
        `\n*【${board_name}】(${cards_list.length})*\n` +
        cards_list.map((card_name: string) => `\t\t* ${card_name}`).join("\n");
      num_tasks += cards_list.length;
    }
  });
  return `今の ${name} のタスク *(${num_tasks})*${text}`;
}

global.main = main;
