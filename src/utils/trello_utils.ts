/**
 * @file A collection of functions useful for handling Trello.
 * @author Shuto Iwasaki <cabernet.rock@gmail.com>
 * @copyright Iwasaki Shuto 2022
 * @license MIT
 */

import { urlencode } from "utils/generic_utils";

export type TrelloBoardListInfo = {
  id: string;
  name: string;
  closed: boolean;
  idBoard: string;
  pos: number;
  subscribed: boolean;
  softLimit?: number;
};

export type TrelloCardInfo = {
  id: string;
  name: string;
  desc: string;
  idBoard: string;
  idList: string;
  dateLastActivity: string;
  pos: number;
  url: string;
  shortLink: string;
  shortUrl: string;
  closed: boolean;
  subscribed: boolean;
  isTemplate: boolean;
};

export const TRELLO_BOARDS_API_EP: string = "https://api.trello.com/1/boards/";

export function getTrelloTasks({
  board_id,
  api_key,
  token,
}: {
  board_id: string;
  api_key: string;
  token: string;
}): Map<string, string[]> {
  const EP_TRELLO_BOARD_LISTS: string = `${TRELLO_BOARDS_API_EP}${board_id}/lists?${urlencode(
    { key: api_key, token: token }
  )}`;
  const EP_TRELLO_BOARD_CARD_LISTS: string = `${TRELLO_BOARDS_API_EP}${board_id}/cards?${urlencode(
    { key: api_key, token: token }
  )}`;

  var boardId2name: Map<string, string> = new Map();
  JSON.parse(UrlFetchApp.fetch(EP_TRELLO_BOARD_LISTS).getContentText()).forEach(
    (e: TrelloBoardListInfo) => {
      boardId2name.set(e.id, e.name);
    }
  );

  var list2cards: Map<string, string[]> = new Map();
  JSON.parse(
    UrlFetchApp.fetch(EP_TRELLO_BOARD_CARD_LISTS).getContentText()
  ).forEach(function (e: TrelloCardInfo) {
    let boardname: string = boardId2name.get(e.idList)!;
    if (boardname in list2cards) {
      let prev: string[] = list2cards.get(boardname)!;
      prev.push(e.name);
      list2cards.set(boardname, prev);
    } else {
      list2cards.set(boardname, [e.name]);
    }
  });
  return list2cards;
}
