import { SNAP_CLASSNAMES, SNAP_STYLE_ID } from "./constants";
import { wipeOut } from "./wipeOut";

type SnapExecuteTargetElement =
  | string
  | string[]
  | HTMLElement
  | NodeListOf<HTMLElement>;

export async function snap(target: SnapExecuteTargetElement) {
  applyStyles();

  let elementArray: HTMLElement[] = [];

  if (typeof target === "string") {
    document
      .querySelectorAll<HTMLElement>(target)
      .forEach((el) => elementArray.push(el));
  }
  if (Array.isArray(target) && typeof target[0] === "string") {
    target.forEach((selector) => {
      document
        .querySelectorAll<HTMLElement>(selector)
        .forEach((el) => elementArray.push(el));
    });
  }
  if (target instanceof NodeList) {
    target.forEach((el) => elementArray.push(el));
  }
  if (target instanceof HTMLElement) {
    elementArray = [target];
  }

  for (const element of elementArray) {
    await wipeOut(element);
  }
}

function applyStyles() {
  if (document.getElementById(SNAP_STYLE_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = SNAP_STYLE_ID;

  style.innerHTML = `
      .${SNAP_CLASSNAMES.wiped_out} {
        visibility: hidden;
      }
    `;

  document.head.appendChild(style);
}
