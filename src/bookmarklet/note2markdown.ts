/**
 * @file Bookmarklet that converts the contents of note to markdown
 * @author Shuto Iwasaki <cabernet.rock@gmail.com>
 * @copyright Iwasaki Shuto 2022
 * @license MIT
 */

import { brTag2n, getLast, imgTag2md, toQuotedMd } from "utils/generic_utils";
import { getDialog, showDialog } from "utils/dialog_utils";

const note2markdown = function (): void {
  /* <--- Get Note Editor --- */
  let nb: HTMLDivElement | null = getLast(
    document.querySelectorAll<HTMLDivElement>("div[contenteditable=true]")
  );
  if (!nb) {
    alert("Noteの編集画面が正しく表示されているかどうか確認してください。");
    return;
  }
  /* <--- End Get Note Editor --- */

  /* <--- Note Basic Information --- */
  let title: string =
    document.getElementById("note-name")?.innerText || "TITLE";
  let header_img: HTMLImageElement | null =
    document.querySelector('img[alt="見出し画像"]');
  let header = header_img && imgTag2md(header_img);
  /* --- End Note Basic Information ---> */

  /* <--- Note Content --- */
  var lines = [header];
  nb.childNodes.forEach((section: ChildNode) => {
    let section_: HTMLElement = section as HTMLElement;
    let text: string = brTag2n(section_.innerHTML);
    switch (section.nodeName) {
      case "P":
        let first: ChildNode = section_.childNodes[0];
        if (first.nodeName == "IMG") {
          lines.push(imgTag2md(first as HTMLImageElement));
        } else {
          text = text.replace(
            /<a.[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g,
            "[$2]($1)"
          );
          text = text
            .replace(/<b>(.*?)<\/b>/g, " **$1** ")
            .replace(/<strong>(.*?)<\/strong>/g, " **$1** ");
          lines.push(text);
        }
        break;
      case "H2":
        lines.push(`## ${text}`);
        break;
      case "H3":
        lines.push(`### ${text}`);
        break;
      case "BLOCKQUOTE":
        lines.push(toQuotedMd(text));
        break;
      case "PRE":
        lines.push(text.replace(/<code>(.*?)<\/code>/g, "```\n$1\n```"));
        break;
      case "FIGURE":
        let img: HTMLImageElement | null = section_.querySelector("img");
        if (img !== null) lines.push(imgTag2md(img));
        let caption: HTMLElement | null = section_.querySelector("figcaption");
        if (caption !== null)
          lines.push(toQuotedMd(brTag2n(caption.innerHTML)));
        break;
    }
  });
  /* --- End Note Content ---> */

  const ID_DLG = "note2infty_dialog";
  const ID_MD = `${ID_DLG}_markdown`;

  let dialog: HTMLDialogElement = getDialog({ id: ID_DLG });
  let mdview: HTMLDivElement = document.createElement("div");
  let mdlabel: HTMLLabelElement = document.createElement("label");
  let mdtext: HTMLTextAreaElement = document.createElement("textarea");
  let titleview: HTMLDivElement = document.createElement("div");
  let titletext: HTMLDivElement = document.createElement("div");
  let closeBtn: HTMLButtonElement = document.createElement("button");
  let copyWrapper: HTMLDivElement = document.createElement("div");
  let copyBtn: HTMLButtonElement = document.createElement("button");

  dialog.id = ID_DLG;
  dialog.style.width = "60vw";
  dialog.style.height = "70vh";
  dialog.style.margin = "auto";

  mdview.style.padding = "30px 5px 10px";
  mdtext.value = lines.join("\n\n");
  // mdtext.readOnly = true;
  mdtext.id = ID_MD;
  mdtext.style.padding = "10px";
  mdtext.style.display = "block";
  mdtext.style.width = "100%";
  mdtext.style.minHeight = "20em";
  mdtext.addEventListener("focus", () => {
    mdtext.select();
  });
  mdlabel.textContent = "【Markdown】";
  mdlabel.appendChild(mdtext);
  mdview.appendChild(mdlabel);

  titleview.style.display = "flex";
  titleview.style.alignItems = "center";
  titleview.style.borderBottom = "1px solid #333";
  titleview.style.padding = "10px";
  titletext.style.marginRight = "auto";
  titletext.style.width = "calc(100% - 50px)";
  titletext.style.wordBreak = "break-all";
  titletext.innerHTML = title;
  closeBtn.style.marginLeft = "auto";
  closeBtn.style.padding = "10px 14px";
  closeBtn.style.borderRadius = "50%";
  closeBtn.style.cursor = "pointer";
  closeBtn.textContent = "x";
  closeBtn.style.width = "40px";
  // closeBtn.addEventListener("click", () => {
  //   dialog.close();
  // });
  titleview.appendChild(titletext);
  titleview.appendChild(closeBtn);

  copyBtn.textContent = "Copy";
  copyBtn.style.marginLeft = "auto";
  copyBtn.style.padding = "5px 10px";
  // copyBtn.addEventListener("click", () => {
  //   navigator.clipboard.writeText(document.getElementById(ID_MD).value);
  //   alert("クリップボードにコピーしました。");
  // });
  copyWrapper.style.display = "flex";
  copyWrapper.appendChild(copyBtn);

  dialog.appendChild(titleview);
  dialog.appendChild(mdview);
  dialog.appendChild(copyWrapper);

  showDialog(dialog);
};

note2markdown();
