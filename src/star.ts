import { Application, Graphics } from "pixi.js";

type StarProps = {
  app: Application;
  x: number;
  xPercent: number;
  y: number;
  radius: number;
  color: string;
  velocityY: number;
  alpha: number;
};

export class Star extends Graphics {
  app: Application;
  color: string;
  radius: number;
  velocityY: number;
  alpha: number;
  xPercent: number;

  constructor({
    alpha,
    app,
    color,
    radius,
    velocityY,
    x,
    y,
    xPercent,
  }: StarProps) {
    super();
    this.app = app;
    this.x = x;
    this.y = y;
    this.xPercent = xPercent;
    this.radius = radius;
    this.velocityY = velocityY;
    this.alpha = alpha;
    this.color = color;

    this.buildCircle();
  }

  setBoundingBox({ x, y }: { x: number; y: number }) {
    this.x = x;
    this.y = y;
  }

  draw() {
    this.y += this.velocityY;

    // back to top
    if (this.y > this.app.screen.height) {
      this.xPercent = Math.min(Math.random() * 100 + 0.01, 100);
      this.x = (this.xPercent / 100) * this.app.screen.width;
      this.y = -Math.ceil(this.radius * 2);
    }
  }

  buildCircle() {
    this.lineStyle(0, this.color, this.alpha);
    this.beginFill(this.color, this.alpha);
    this.drawCircle(0, 0, this.radius);
    this.endFill();
  }
}
