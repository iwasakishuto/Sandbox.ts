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
