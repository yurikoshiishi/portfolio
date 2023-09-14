import { Text, TextStyle } from "pixi.js";
import { Game } from "./game";
import { TechnologyController } from "./technology-controller";

type StartMessageProps = {
  game: Game;
  technologyController: TechnologyController;
  fontFace: FontFace;
};

export class StartMessage extends Text {
  game: Game;
  technologyController: TechnologyController;
  animationProgress: number;
  animationDirection: number;

  constructor({ game, fontFace, technologyController }: StartMessageProps) {
    super(
      "Press Arrow & Space Keys to Play",
      new TextStyle({
        fontFamily: fontFace.family,
        fontSize: 14,
        fontWeight: "400",
        fill: "#fff",
      }),
    );
    this.game = game;
    this.technologyController = technologyController;
    this.x = this.game.app.screen.width / 2 - this.width / 2;
    this.y =
      this.technologyController.technologies[
        this.technologyController.technologies.length - 1
      ].y +
      this.height +
      100;
    this.alpha = 0;
    this.animationDirection = 1;
    this.animationProgress = 0;

    this.game.app.ticker.add(this.onTick);
  }

  onTick = () => {
    this.animationProgress +=
      (this.animationProgress < 0.3 ? 0.05 : 0.01) * this.animationDirection;
    this.animationProgress = clamp({
      value: this.animationProgress,
      min: 0,
      max: 1,
    });
    this.alpha = easeInOutExpo(this.animationProgress);

    if (this.animationProgress >= 1 || this.animationProgress <= 0) {
      this.animationDirection = -this.animationDirection;
    }
  };

  hideAndDestroy() {
    this.game.app.ticker.remove(this.onTick);

    const hide = () => {
      this.animationProgress -= 0.015;
      this.animationProgress = clamp({
        value: this.animationProgress,
        min: 0,
        max: 1,
      });
      this.alpha = easeInOutExpo(this.animationProgress);

      if (this.alpha <= 0) {
        this.game.app.ticker.remove(hide);
        this.destroy();
      }
    };

    this.game.app.ticker.add(hide);
  }

  onDeviceChange() {
    this.x = this.game.app.screen.width / 2 - this.width / 2;
    if (this.technologyController.technologies.length) {
      this.y =
        this.technologyController.technologies[
          this.technologyController.technologies.length - 1
        ].y +
        this.height +
        100;
    }
  }
}

function clamp({
  value,
  max,
  min,
}: {
  value: number;
  min: number;
  max: number;
}) {
  return Math.min(Math.max(value, min), max);
}

function easeInOutExpo(x: number): number {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}
