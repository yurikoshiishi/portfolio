import { Application, Graphics } from "pixi.js";
import { Entity } from "./entity";

type BulletProps = {
  app: Application;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  color: string;
};

export class Bullet extends Graphics {
  app: Application;
  velocityY: number;
  color: string;
  bulletWidth: number;
  bulletHeight: number;

  constructor({ app, height, width, x, y, color, velocityY }: BulletProps) {
    super();
    this.app = app;
    this.x = x;
    this.y = y;
    this.bulletWidth = width;
    this.bulletHeight = height;
    this.color = color;
    this.velocityY = velocityY;

    this.buildBullet();
  }

  draw() {
    this.y -= this.velocityY;
  }

  buildBullet() {
    this.beginFill(this.color);
    this.drawRect(0, 0, this.bulletWidth, this.bulletHeight);
    this.endFill();
  }

  collideWith(entity: Entity) {
    return (
      this.x + this.width > entity.x &&
      this.x < entity.x + entity.width &&
      this.y + this.height > entity.y &&
      this.y < entity.y + entity.height
    );
  }
}
