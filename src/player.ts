import { Resource, Sprite, Texture } from "pixi.js";
import { BulletController } from "./bullet-controller";
import { Device, Game } from "./game";
import { Direction, TouchController } from "./touch-controller";

const PLAYER_SIZES: Record<Device, number> = {
  mobile: 80,
  tablet: 80,
  desktop: 50,
  largeDesktop: 50,
};

type PlayerProps = {
  game: Game;
  source: Texture<Resource>;
  velocity: number;
  bulletController: BulletController;
};

export class Player extends Sprite {
  game: Game;
  rightPressed: boolean;
  leftPressed: boolean;
  shootPressed: boolean;
  velocity: number;
  bulletController: BulletController;
  touchController: TouchController;
  autoShoot: boolean;

  constructor({ game, source, velocity, bulletController }: PlayerProps) {
    super(source);
    this.game = game;
    this.height = PLAYER_SIZES[this.game.device];
    this.width = PLAYER_SIZES[this.game.device];
    this.x = this.game.app.screen.width / 2 - this.width / 2;
    this.y = this.game.app.screen.height - this.height - 30;
    this.velocity = velocity;
    this.bulletController = bulletController;
    this.rightPressed = false;
    this.leftPressed = false;
    this.shootPressed = false;
    this.autoShoot = false;
    this.touchController = new TouchController({
      game: this.game,
      onTouchStart: this.onTouchStart,
      onTouchEnd: this.onTouchEnd,
    });

    document.addEventListener("keydown", this.keydown);
    document.addEventListener("keyup", this.keyup);

    this.game.app.ticker.add(() => {
      this.draw();
    });
  }

  onDeviceChange() {
    this.height = PLAYER_SIZES[this.game.device];
    this.width = PLAYER_SIZES[this.game.device];
    this.x = this.game.app.screen.width / 2 - this.width / 2;
    this.y = this.game.app.screen.height - this.height - 30;
  }

  draw() {
    if (this.game.isFinished) {
      this.autoShoot = false;
    }

    if (this.autoShoot || this.shootPressed) {
      this.bulletController.shoot({
        x: this.x + this.width / 2 - 3 / 2,
        y: this.y - 20,
        velocityY: 4,
        timeTillNextBulletAllowed: 10,
        color: "#61D6FF",
        width: 3,
        height: 20,
      });
    }
    this.bulletController.draw();
    this.move();
    this.collideWithWalls();
  }

  collideWithWalls() {
    if (this.x < 0) {
      this.x = 0;
    }

    if (this.x > this.game.app.screen.width - this.width) {
      this.x = this.game.app.screen.width - this.width;
    }
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    }
  }

  onTouchStart = (direction: Direction) => {
    this.game.isKeyPressed = true;
    // auto shoot in mobile devices
    this.autoShoot = true;

    switch (direction) {
      case "left": {
        this.leftPressed = true;
        break;
      }
      case "right": {
        this.rightPressed = true;
        break;
      }
    }
  };

  onTouchEnd = (direction: Direction) => {
    switch (direction) {
      case "left": {
        this.leftPressed = false;
        break;
      }
      case "right": {
        this.rightPressed = false;
        break;
      }
    }
  };

  keydown = (event: KeyboardEvent) => {
    this.game.isKeyPressed = true;

    if (event.code == "ArrowRight") {
      this.rightPressed = true;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = true;
    }
    if (event.code == "Space") {
      this.shootPressed = true;
    }
  };

  keyup = (event: KeyboardEvent) => {
    if (event.code == "ArrowRight") {
      this.rightPressed = false;
    }
    if (event.code == "ArrowLeft") {
      this.leftPressed = false;
    }
    if (event.code == "Space") {
      this.shootPressed = false;
    }
  };
}
