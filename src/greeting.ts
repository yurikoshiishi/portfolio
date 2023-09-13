import { Text, TextStyle } from "pixi.js";
import { Game } from "./game";
import { TechnologyController } from "./technology-controller";

type GreetingProps = {
  game: Game;
  technologyController: TechnologyController;
  fontFace: FontFace;
};

export class Greeting extends Text {
  game: Game;
  technologyController: TechnologyController;

  constructor({ game, fontFace, technologyController }: GreetingProps) {
    super(
      "Hi, I'm Yuri Koshiishi",
      new TextStyle({
        fontFamily: fontFace.family,
        fontSize: 30,
        fontWeight: "400",
        fill: "#fff",
      })
    );
    this.game = game;
    this.technologyController = technologyController;
    this.x = this.game.app.screen.width / 2 - this.width / 2;
    this.y =
      this.technologyController.technologies[0].y -
      this.height -
      this.technologyController.size;
  }

  onDeviceChange() {
    this.x = this.game.app.screen.width / 2 - this.width / 2;
    if (this.technologyController.technologies.length) {
      this.y =
        this.technologyController.technologies[0].y -
        this.height -
        this.technologyController.size;
    }
  }
}
