import { Device, Game } from "./game";
import { Star } from "./star";

const NUMBER_OF_STARS: Record<Device, number> = {
  mobile: 50,
  tablet: 75,
  desktop: 100,
  largeDesktop: 100,
};

const STAR_COLORS = ["#9DB5FF", "#FFFFFF", "#FFE8A3", "#FFFF66"];

type BackgroundProps = {
  game: Game;
};

export class Background {
  game: Game;
  numberOfStars: number;
  stars: Star[];

  constructor({ game }: BackgroundProps) {
    this.game = game;
    this.numberOfStars = NUMBER_OF_STARS[this.game.device];
    this.stars = [];

    for (let i = 0; i < this.numberOfStars; i++) {
      const xPercent = Math.min(Math.random() * 100 + 0.01, 100);

      const star = new Star({
        app: this.game.backgroundApp,
        radius: Math.random() * 2 + 0.25,
        color: pickRandom(STAR_COLORS),
        x: (xPercent / 100) * this.game.backgroundApp.screen.width,
        y: Math.random() * this.game.backgroundApp.screen.height,
        xPercent,
        velocityY: Math.max(0.05, Math.random() / 5),
        alpha: Math.random() + 0.3,
      });

      this.stars.push(star);

      this.game.backgroundApp.stage.addChild(star);
    }

    this.game.backgroundApp.ticker.add(() => {
      this.draw();
    });
  }

  draw() {
    this.stars.forEach((star) => star.draw());
  }

  onResize() {
    this.stars.forEach((star) => {
      star.x = (star.xPercent / 100) * this.game.backgroundApp.screen.width;
    });
  }

  onDeviceChange() {
    this.numberOfStars = NUMBER_OF_STARS[this.game.device];

    if (this.stars.length < this.numberOfStars) {
      const numberOfStarsToCreate = this.numberOfStars - this.stars.length;

      for (let i = 0; i < numberOfStarsToCreate; i++) {
        const xPercent = Math.min(Math.random() * 100 + 0.01, 100);
        const star = new Star({
          app: this.game.backgroundApp,
          radius: Math.random() * 2 + 0.25,
          color: pickRandom(STAR_COLORS),
          x: (xPercent / 100) * this.game.backgroundApp.screen.width,
          y: Math.random() * this.game.backgroundApp.screen.height,
          xPercent,
          velocityY: Math.max(0.05, Math.random() / 5),
          alpha: Math.random() + 0.3,
        });

        this.stars.push(star);

        this.game.backgroundApp.stage.addChild(star);
      }
    } else if (this.stars.length > this.numberOfStars) {
      const starsToRemove = this.stars.splice(
        this.numberOfStars,
        this.numberOfStars,
      );

      starsToRemove.forEach((star) => {
        star.destroy();
      });
    }

    // make sure the resize is complete before updating positions
    this.game.backgroundApp.resize();

    this.stars.forEach((star) => {
      star.setBoundingBox({
        x: Math.random() * this.game.backgroundApp.screen.width,
        y: Math.random() * this.game.backgroundApp.screen.height,
      });
    });
  }
}

function pickRandom<T>(arr: T[]): T {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
