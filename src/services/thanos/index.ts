import {findTextNodesUnderElement, isTextNode} from './utils';

const THANOS_STYLE_ID = 'thanos-style';
const THANOS_SNAP_TARGET_CLASS = 'thanos-snap-target';
const THANOS_SNAP_ACTIVE_CLASS = 'snapped';

export class Thanos {
  textNodes: Node[];
  constructor() {
    this.textNodes = [];
    this.appendStyles();
  }

  appendStyles() {
    const style = document.createElement('style');
    style.id = THANOS_STYLE_ID;

    style.innerHTML = `
        .${THANOS_SNAP_TARGET_CLASS} {
            opacity: 1;
            transition: opacity 3s; 
        }

        .${THANOS_SNAP_ACTIVE_CLASS} .${THANOS_SNAP_TARGET_CLASS} {
            opacity: 0;
        }
      `;

    const existingStyle = document.getElementById(THANOS_STYLE_ID);

    if (existingStyle) {
      existingStyle.innerHTML = style.innerHTML;
    } else {
      document.head.appendChild(style);
    }
  }

  async snap() {
    this.textNodes = this.findAllTextNodes();
    this.textNodes.forEach(this.setTargetLettersWithinTextNode);
    await new Promise((resolve) => setTimeout(resolve, 1));
    document.body.classList.add(THANOS_SNAP_ACTIVE_CLASS);
  }

  findAllTextNodes() {
    const textNodes = findTextNodesUnderElement(
      document.querySelector('body')!
    );

    return textNodes;
  }

  setTargetLettersWithinTextNode(textNode: Node) {
    if (!isTextNode(textNode)) {
      return;
    }
    const text = textNode.textContent;

    if (!text) {
      return;
    }

    const replacedTextHTML = text
      .split('')
      .map((letter) => {
        const shouldSnap = Math.random() >= 0.5;

        if (!shouldSnap) {
          return letter;
        }

        return `<span class="${THANOS_SNAP_TARGET_CLASS}">${letter}</span>`;
      })
      .join('');

    const newNode = document.createElement('span');
    newNode.innerHTML = replacedTextHTML;
    textNode.replaceWith(newNode);
  }
}
