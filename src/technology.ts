import {
  Application,
  Container,
  Rectangle,
  Resource,
  Sprite,
  Texture,
} from "pixi.js";

type TechnologyProps = {
  app: Application;
  source: Texture<Resource>;
  x: number;
  y: number;
  width: number;
  height: number;
};

const EXPLOSION_GRID_COUNT = 900;
const EXPLOSION_GRID_COUNT_IN_LINE = Math.sqrt(EXPLOSION_GRID_COUNT);

export class Technology extends Sprite {
  app: Application;

  constructor({ app, height, source, width, x, y }: TechnologyProps) {
    super(source);
    this.app = app;
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
  }

  setBoundingBox({
    height,
    width,
    x,
    y,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    this.height = height;
    this.width = width;
    this.x = x;
    this.y = y;
  }

  async explodeAndDestroy() {
    const container = new Container();
    const sprites: Sprite[] = [];

    this.app.stage.addChild(container);

    for (let i = 0; i < EXPLOSION_GRID_COUNT; i++) {
      const rowIndex = Math.floor(i / EXPLOSION_GRID_COUNT_IN_LINE);
      const columnIndex = i % EXPLOSION_GRID_COUNT_IN_LINE;

      const texture = new Texture(
        this.texture.baseTexture,
        new Rectangle(
          this.texture.frame.x +
            (columnIndex * this.texture.width) / EXPLOSION_GRID_COUNT_IN_LINE,
          this.texture.frame.y +
            (rowIndex * this.texture.height) / EXPLOSION_GRID_COUNT_IN_LINE,
          this.texture.width / EXPLOSION_GRID_COUNT_IN_LINE,
          this.texture.height / EXPLOSION_GRID_COUNT_IN_LINE,
        ),
      );

      const sprite = new Sprite(texture);
      sprite.width = this.width / EXPLOSION_GRID_COUNT_IN_LINE;
      sprite.height = this.height / EXPLOSION_GRID_COUNT_IN_LINE;
      sprite.x = columnIndex * (this.width / EXPLOSION_GRID_COUNT_IN_LINE);
      sprite.y = rowIndex * (this.height / EXPLOSION_GRID_COUNT_IN_LINE);

      sprites.push(sprite);
      container.addChild(sprite);
    }

    container.x = this.x;
    container.y = this.y;

    let speed = 0.1;
    let alpha = 1;

    const explode = () => {
      speed += 0.02;
      alpha -= Math.random() * 0.01;
      sprites.forEach((sprite, i) => {
        if (alpha <= 0) {
          sprite.destroy();
          sprites.splice(i, 1);
          return;
        }
        sprite.x += speed * Math.random() * (Math.random() < 0.5 ? -1 : 1);
        sprite.y += speed * Math.random() * (Math.random() < 0.5 ? -1 : 1);
        sprite.alpha = alpha;
      });

      if (!sprites.length) {
        this.app.ticker.remove(explode);
        container.destroy();
      }
    };

    this.app.ticker.add(explode);

    this.destroy();
  }
}
