import { Application, ICanvas } from "pixi.js";
import { Assets } from "./asset-manager";
import { Background } from "./background";
import { BulletController } from "./bullet-controller";
import { Greeting } from "./greeting";
import { Player } from "./player";
import { StartMessage } from "./start-message";
import { TechnologyController } from "./technology-controller";

export type Device = "mobile" | "tablet" | "desktop" | "largeDesktop";

type Breakpoint = {
  minWidth: number | null;
  maxWidth: number | null;
  device: Device;
};

const BREAKPOINTS = [
  { minWidth: null, maxWidth: 639, device: "mobile" },
  { minWidth: 640, maxWidth: 1023, device: "tablet" },
  { minWidth: 1024, maxWidth: 1279, device: "desktop" },
  { minWidth: 1280, maxWidth: null, device: "largeDesktop" },
] satisfies Breakpoint[];

const GAME_SIZES: Record<Device, { width: number; height: number }> = {
  mobile: {
    width: 256 * 3,
    height: 224 * 4,
  },
  tablet: {
    width: 256 * 3,
    height: 224 * 4,
  },
  desktop: {
    width: 256 * 3,
    height: 224 * 3,
  },
  largeDesktop: {
    width: 256 * 3,
    height: 224 * 3,
  },
};

const FPS = 60;

type GameProps = {
  gameCanvas: HTMLCanvasElement;
  backgroundCanvas: HTMLCanvasElement;
};

export class Game {
  app: Application;
  backgroundApp: Application;
  device: Device;
  size: { width: number; height: number };
  resolution: number;
  background: Background;
  player: Player | null;
  technologyController: TechnologyController | null;
  greeting: Greeting | null;
  startMessage: StartMessage | null;
  isKeyPressed: boolean;
  isFinished: boolean;

  constructor({ gameCanvas, backgroundCanvas }: GameProps) {
    this.device = (
      BREAKPOINTS.find((breakpoint) => {
        return getMediaQueryList(breakpoint).matches;
      }) || BREAKPOINTS[2]
    ).device;
    this.size = GAME_SIZES[this.device];
    this.resolution = window.devicePixelRatio || 1;
    this.player = null;
    this.technologyController = null;
    this.greeting = null;
    this.startMessage = null;
    this.isKeyPressed = false;
    this.isFinished = false;
    this.app = new Application({
      backgroundAlpha: 0,
      width: this.size.width,
      height: this.size.height,
      view: gameCanvas as unknown as ICanvas,
      resolution: this.resolution,
    });
    this.backgroundApp = new Application({
      backgroundColor: "#000000",
      view: backgroundCanvas as unknown as ICanvas,
      resolution: this.resolution,
      resizeTo: window,
      autoDensity: true,
    });
    this.app.ticker.maxFPS = FPS;
    this.backgroundApp.ticker.maxFPS = FPS;

    this.background = new Background({ game: this });

    // TODO: show loading
    this.watchMediaQueryListChange();
    this.watchWindowResize();
  }

  async start({ assets }: { assets: Assets }) {
    const playerBulletController = new BulletController({
      game: this,
      maxBullets: 10,
    });
    this.player = new Player({
      game: this,
      source: assets.image.spaceship,
      velocity: 4,
      bulletController: playerBulletController,
    });
    this.app.stage.addChild(this.player);

    this.technologyController = new TechnologyController({
      game: this,
      playerBulletController,
    });
    // async because it needs to parse spritesheet
    await this.technologyController.start({
      spritesheetTexture: assets.image.technologySpritesheet,
    });

    this.greeting = new Greeting({
      game: this,
      technologyController: this.technologyController,
      fontFace: assets.font.pressStart2p,
    });
    this.app.stage.addChild(this.greeting);

    // TODO: refactor touch screen checking
    if (!this.player.touchController.hasTouchScreen()) {
      this.startMessage = new StartMessage({
        game: this,
        technologyController: this.technologyController,
        fontFace: assets.font.pressStart2p,
      });
      this.app.stage.addChild(this.startMessage);

      const waitForKeyPress = () => {
        if (this.isKeyPressed) {
          this.startMessage?.hideAndDestroy();
          this.app.ticker.remove(waitForKeyPress);
          this.startMessage = null;
        }
      };
      this.app.ticker.add(waitForKeyPress);
    }
  }

  finish() {
    this.isFinished = true;

    // TODO: achievement unlocked
  }

  watchWindowResize() {
    let isThrottled: boolean = false;

    window.addEventListener("resize", () => {
      if (isThrottled) {
        return;
      }

      isThrottled = true;
      this.onResize();

      setTimeout(() => {
        isThrottled = false;
      }, 1000 / 60);
    });
  }

  onResize() {
    this.background.onResize();
  }

  watchMediaQueryListChange() {
    BREAKPOINTS.forEach((breakpoint) => {
      const mql = getMediaQueryList(breakpoint);

      const onChangeMediaQueryList = (e: MediaQueryListEvent) => {
        if (e.matches) {
          this.onDeviceChange(breakpoint.device);
        }
      };

      mql.addEventListener("change", onChangeMediaQueryList);
    });
  }

  onDeviceChange(device: Device) {
    this.device = device;
    this.size = GAME_SIZES[this.device];
    this.app.renderer.resize(this.size.width, this.size.height);

    this.background.onDeviceChange();
    this.player?.onDeviceChange();
    this.technologyController?.onDeviceChange();
    this.greeting?.onDeviceChange();

    if (this.startMessage && this.player?.touchController.hasTouchScreen()) {
      this.app.stage.removeChild(this.startMessage);
      this.startMessage = null;
    } else {
      this.startMessage?.onDeviceChange();
    }
  }
}

function getMediaQueryList(breakpoint: Breakpoint): MediaQueryList {
  const queries: string[] = [];

  if (typeof breakpoint.minWidth === "number") {
    queries.push(`(min-width: ${breakpoint.minWidth}px)`);
  }

  if (typeof breakpoint.maxWidth === "number") {
    queries.push(`(max-width: ${breakpoint.maxWidth}px)`);
  }

  const mql = window.matchMedia(queries.join(" and "));

  return mql;
}
