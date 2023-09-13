import { Assets, Texture } from "pixi.js";

type ImageAsset = "technologySpritesheet" | "spaceship";
type FontAsset = "pressStart2p";

export type Assets = {
  image: Record<ImageAsset, Texture>;
  font: Record<FontAsset, FontFace>;
};

export async function loadAssets(): Promise<Assets> {
  Assets.addBundle("image", {
    technologySpritesheet: "assets/spritesheet.png",
    spaceship: "assets/spaceship.png",
  });

  Assets.addBundle("font", {
    pressStart2p: "fonts/PressStart2P-Regular.ttf",
  });

  const [image, font] = await Promise.all([
    Assets.loadBundle("image"),
    Assets.loadBundle("font"),
  ]);

  return {
    image,
    font,
  };
}
