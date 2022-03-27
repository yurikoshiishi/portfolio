import { SNAP_CLASSNAMES } from "./constants";

export function undo() {
  const wipedOutElements = document.querySelectorAll(
    `.${SNAP_CLASSNAMES.wiped_out}`
  );

  wipedOutElements.forEach((el) =>
    el.classList.remove(SNAP_CLASSNAMES.wiped_out)
  );
}
