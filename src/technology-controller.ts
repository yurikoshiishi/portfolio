import { Spritesheet, Texture } from "pixi.js";
import { BulletController } from "./bullet-controller";
import { Device, Game } from "./game";
import { Technology } from "./technology";

const NUMBER_OF_TECHNOLOGIES = 24;
const TECHNOLOGY_SOURCE_SIZE = 256;

const NUMBER_OF_COLUMNS: Record<Device, number> = {
  mobile: 6,
  tablet: 6,
  desktop: 8,
  largeDesktop: 8,
};
const TECHNOLOGY_SIZES: Record<Device, number> = {
  mobile: 70,
  tablet: 70,
  desktop: 42,
  largeDesktop: 42,
};
const TECHNOLOGY_SPACINGS: Record<Device, number> = {
  mobile: 16,
  tablet: 16,
  desktop: 12,
  largeDesktop: 12,
};

type TechnologyControllerProps = {
  game: Game;
  playerBulletController: BulletController;
};

export class TechnologyController {
  game: Game;
  numberOfColumn: number;
  size: number;
  spacing: number;
  technologies: Technology[];
  playerBulletController: BulletController;

  constructor({ game, playerBulletController }: TechnologyControllerProps) {
    this.game = game;
    this.numberOfColumn = NUMBER_OF_COLUMNS[this.game.device];
    this.size = TECHNOLOGY_SIZES[this.game.device];
    this.spacing = TECHNOLOGY_SPACINGS[this.game.device];
    this.technologies = [];
    this.playerBulletController = playerBulletController;
  }

  async start({ spritesheetTexture }: { spritesheetTexture: Texture }) {
    const spritesheet = await this.parseSpritesheet(spritesheetTexture);

    const columnWidth = this.size + this.spacing;
    const columnHeight = this.size + this.spacing;
    const numberOfRows = Math.floor(
      NUMBER_OF_TECHNOLOGIES / this.numberOfColumn
    );
    const rowWidth = this.numberOfColumn * columnWidth;
    const gridHeight = numberOfRows * columnHeight;

    for (let i = 0; i < NUMBER_OF_TECHNOLOGIES; i++) {
      const rowIndex = Math.floor(i / this.numberOfColumn);
      const columnIndex = i % this.numberOfColumn;

      const technology = new Technology({
        source: spritesheet.textures[`technology${i + 1}`],
        app: this.game.app,
        height: this.size,
        width: this.size,
        x:
          this.game.app.screen.width / 2 -
          rowWidth / 2 +
          columnIndex * this.size +
          columnIndex * this.spacing,
        y:
          this.game.app.screen.height / 2 -
          gridHeight / 2 +
          rowIndex * this.size +
          rowIndex * this.spacing,
      });

      this.game.app.stage.addChild(technology);

      this.technologies.push(technology);
    }

    this.game.app.ticker.add(() => {
      this.technologies.forEach((technology, i) => {
        if (this.playerBulletController.collideWith(technology)) {
          technology.explodeAndDestroy();
          this.technologies.splice(i, 1);
        }
      });

      if (this.technologies.length === 0) {
        this.game.finish();
      }
    });
  }

  onDeviceChange() {
    this.numberOfColumn = NUMBER_OF_COLUMNS[this.game.device];
    this.size = TECHNOLOGY_SIZES[this.game.device];
    this.spacing = TECHNOLOGY_SPACINGS[this.game.device];

    const columnWidth = this.size + this.spacing;
    const columnHeight = this.size + this.spacing;
    const numberOfRows = Math.floor(
      NUMBER_OF_TECHNOLOGIES / this.numberOfColumn
    );
    const rowWidth = this.numberOfColumn * columnWidth;
    const gridHeight = numberOfRows * columnHeight;

    this.technologies.forEach((technology, i) => {
      const rowIndex = Math.floor(i / this.numberOfColumn);
      const columnIndex = i % this.numberOfColumn;

      technology.setBoundingBox({
        height: this.size,
        width: this.size,
        x:
          this.game.app.screen.width / 2 -
          rowWidth / 2 +
          columnIndex * this.size +
          columnIndex * this.spacing,
        y:
          this.game.app.screen.height / 2 -
          gridHeight / 2 +
          rowIndex * this.size +
          rowIndex * this.spacing,
      });
    });
  }

  async parseSpritesheet(spritesheetTexture: Texture): Promise<Spritesheet> {
    const spritesheet = new Spritesheet(spritesheetTexture, {
      meta: {
        scale: "1",
      },
      frames: Array.from({ length: NUMBER_OF_TECHNOLOGIES }).reduce<any>(
        (map, _, i) => {
          const key = `technology${i + 1}`;
          map[key] = {
            frame: {
              x: i * TECHNOLOGY_SOURCE_SIZE,
              y: 0,
              w: TECHNOLOGY_SOURCE_SIZE,
              h: TECHNOLOGY_SOURCE_SIZE,
            },
            sourceSize: {
              w: TECHNOLOGY_SOURCE_SIZE,
              h: TECHNOLOGY_SOURCE_SIZE,
            },
            spriteSourceSize: {
              x: 0,
              y: 0,
              w: NUMBER_OF_TECHNOLOGIES * TECHNOLOGY_SOURCE_SIZE,
              h: TECHNOLOGY_SOURCE_SIZE,
            },
          };

          return map;
        },
        {}
      ),
    });

    await spritesheet.parse();

    return spritesheet;
  }
}
