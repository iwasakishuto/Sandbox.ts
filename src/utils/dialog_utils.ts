/**
 * @file Utility functions for Dialog box.
 * @author Shuto Iwasaki <cabernet.rock@gmail.com>
 * @copyright Iwasaki Shuto 2022
 * @license MIT
 */

export function getDialog({
  id = "_bookmarklet_dialog",
  width = "60vw",
  height = "70vh",
  margin = "auto",
}: {
  id?: string;
  width?: string;
  height?: string;
  margin?: string;
}): HTMLElement {
  //** <--- Initialize a dialog --- */
  var dialog: HTMLElement | null = document.getElementById(id);
  if (dialog == null) {
    dialog = document.createElement("dialog");
  }
  dialog.innerHTML = "";
  //** --- END Initialize a dialog ---> */

  //** <--- Style the dialog --- */
  dialog.id = id;
  dialog.style.width = width;
  dialog.style.height = height;
  dialog.style.margin = margin;
  //** --- END Style the dialog ---> */

  return dialog;
}

export function showDialog(dialog: HTMLElement): void {
  document.body.appendChild(dialog);
  // dialog.showModal():
}
