/**
 * @file A collection of functions useful for various purposes.
 * @author Shuto Iwasaki <cabernet.rock@gmail.com>
 * @copyright Iwasaki Shuto 2022
 * @license MIT
 */

export function brTag2n(text: string): string {
  return text !== undefined ? text.split(/<br.*?>/).join("\n") : "";
}

export function toQuotedMd(text: string): string {
  return text !== undefined ? `> ${text.split("\n").join("\n> ")}` : "";
}

export function imgTag2md(img: HTMLImageElement) {
  return `![${img?.alt}](${img?.src})`;
}

export function getLast(list: any[] | NodeListOf<Element>): any {
  return list[list.length - 1];
}

/**
 * @summary URL encoding for django-API
 * @return {String} Encoded URL string.
 */
export function urlencode({ ...params }): string {
  var queries: string[] = [];
  Object.entries(params).forEach((e) => {
    const [key, value] = e;
    if (value) {
      queries.push(`${key}=${value}`);
    }
  });
  return queries.join("&");
}
