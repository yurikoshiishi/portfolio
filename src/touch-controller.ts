import { Game } from "./game";

const DIRECTIONS = ["left", "right"] as const;
export type Direction = (typeof DIRECTIONS)[number];

type TouchControllerProps = {
  game: Game;
  onTouchStart: (direction: Direction) => void;
  onTouchEnd: (direction: Direction) => void;
};

export class TouchController {
  game: Game;
  left: HTMLButtonElement;
  right: HTMLButtonElement;
  onTouchStart: (direction: Direction) => void;
  onTouchEnd: (direction: Direction) => void;

  constructor({ game, onTouchEnd, onTouchStart }: TouchControllerProps) {
    this.game = game;
    this.onTouchStart = onTouchStart;
    this.onTouchEnd = onTouchEnd;
    const { leftButton, rightButton } = this.renderElements();
    this.left = leftButton;
    this.right = rightButton;

    this.attachEventListeners();

    if (this.hasTouchScreen()) {
      document.documentElement.setAttribute("data-touch-screen", "");
    }
  }

  /** https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent */
  hasTouchScreen() {
    let hasTouchScreen = false;
    if ("maxTouchPoints" in navigator) {
      hasTouchScreen = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      //@ts-ignore
      hasTouchScreen = navigator.msMaxTouchPoints > 0;
    } else {
      const mQ = matchMedia?.("(pointer:coarse)");
      if (mQ?.media === "(pointer:coarse)") {
        hasTouchScreen = mQ.matches;
      } else if ("orientation" in window) {
        hasTouchScreen = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        //@ts-ignore
        const UA = navigator.userAgent;
        hasTouchScreen =
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
      }
    }

    return hasTouchScreen;
  }

  attachEventListeners() {
    DIRECTIONS.forEach((direction) => {
      this[direction].addEventListener("touchstart", (e) => {
        e.preventDefault();
        this[direction].classList.add("pressed");
        this.onTouchStart(direction);
      });

      this[direction].addEventListener("touchend", (e) => {
        e.preventDefault();
        this[direction].classList.remove("pressed");
        this.onTouchEnd(direction);
      });
    });
  }

  renderElements() {
    const container = document.createElement("div");
    container.id = "game-controller";

    const leftButton = document.createElement("button");
    const rightButton = document.createElement("button");

    leftButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>`;
    leftButton.classList.add("arrow");
    leftButton.draggable = false;

    rightButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;
    rightButton.classList.add("arrow");
    leftButton.draggable = false;

    container.append(leftButton, rightButton);

    document.body.appendChild(container);

    return {
      leftButton,
      rightButton,
    };
  }
}
