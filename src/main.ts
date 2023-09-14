import { loadAssets } from "./asset-manager";
import { Game } from "./game";

const assetsPromise = loadAssets();

document.addEventListener("DOMContentLoaded", async () => {
  const game = new Game({
    gameCanvas: document.querySelector("#game") as HTMLCanvasElement,
    backgroundCanvas: document.querySelector(
      "#background",
    ) as HTMLCanvasElement,
  });

  const assets = await assetsPromise;

  game.start({ assets });
});
