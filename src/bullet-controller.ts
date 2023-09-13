import { Bullet } from "./bullet";
import { Entity } from "./entity";
import { Game } from "./game";

type BulletControllerProps = {
  game: Game;
  maxBullets: number;
};

export class BulletController {
  game: Game;
  bullets: Bullet[];
  maxBullets: number;
  timeTillNextBulletAllowed: number;

  constructor({ game, maxBullets }: BulletControllerProps) {
    this.game = game;
    this.bullets = [];
    this.maxBullets = maxBullets;
    this.timeTillNextBulletAllowed = 0;
  }

  draw() {
    const bulletsForNextFrame: Bullet[] = [];

    this.bullets.forEach((bullet) => {
      // TODO: check window height, instead of game height
      if (
        bullet.y + bullet.width > 0 &&
        bullet.y <= this.game.app.screen.height
      ) {
        bulletsForNextFrame.push(bullet);
        bullet.draw();
      } else {
        bullet.destroy();
      }
    });

    this.bullets = bulletsForNextFrame;

    if (this.timeTillNextBulletAllowed > 0) {
      this.timeTillNextBulletAllowed--;
    }
  }

  collideWith(entity: Entity) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(entity)
    );

    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets[bulletThatHitSpriteIndex].destroy();
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }

    return false;
  }

  shoot({
    x,
    y,
    width,
    height,
    color,
    velocityY,
    timeTillNextBulletAllowed = 0,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    velocityY: number;
    timeTillNextBulletAllowed: number;
  }) {
    if (
      this.timeTillNextBulletAllowed <= 0 &&
      this.bullets.length < this.maxBullets
    ) {
      const bullet = new Bullet({
        width,
        height,
        app: this.game.app,
        color,
        velocityY,
        x,
        y,
      });
      this.game.app.stage.addChild(bullet);
      this.bullets.push(bullet);
      this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }
}
