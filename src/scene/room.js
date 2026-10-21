import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

/* ------------------------------------------------------------------
   The meeting room. The far room is a single path-traced light probe
   (tools/blender/room.py), used both as the out-of-focus background and
   as the light on the cards. Only the table is real geometry: it is the
   one surface the camera ever focuses on besides the cards.

   Axes: table top at y = 0, the window wall is far along +x, the table
   runs along z.
   ------------------------------------------------------------------ */

const TABLE = { x: 1.3, z: 4.6, t: 0.04 };

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Close-grained walnut under a deep lacquer: the grain is barely there,
   it only has to keep the reflection from reading as glass. */
function walnut(aniso) {
  const W = 512;
  const H = 2048;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const img = ctx.createImageData(W, H);
  const rand = rng(17);
  const lines = new Float32Array(W);
  let v = 0;
  for (let x = 0; x < W; x++) {
    v += (rand() - 0.5) * 0.9;
    v *= 0.97;
    lines[x] = v;
  }
  for (let y = 0; y < H; y++) {
    const wob = Math.sin(y * 0.004) * 6 + Math.sin(y * 0.0013 + 1.7) * 14;
    for (let x = 0; x < W; x++) {
      const g = lines[(x + Math.round(wob) + W) % W];
      const k = 0.86 + g * 0.05 + Math.sin((x + wob) * 0.09 + g * 3) * 0.035;
      const j = (y * W + x) * 4;
      img.data[j] = 26 * k;
      img.data[j + 1] = 17 * k;
      img.data[j + 2] = 13 * k;
      img.data[j + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1.5, 2);
  t.anisotropy = aniso;
  return t;
}

export async function buildRoom(renderer, scene, url, onProgress) {
  RectAreaLightUniformsLib.init();
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const hdr = await new RGBELoader().loadAsync(url, onProgress);
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(hdr).texture;
  pmrem.dispose();

  /* the probe's forward (+y in Blender, the window) lands on +x here */
  const turn = new THREE.Euler(0, 0, 0);
  scene.background = hdr;
  scene.backgroundRotation.copy(turn);
  scene.backgroundBlurriness = 0.035;
  scene.backgroundIntensity = 1;
  scene.environment = env;
  scene.environmentRotation.copy(turn);
  scene.environmentIntensity = 1;

  const table = new THREE.Mesh(
    new THREE.BoxGeometry(TABLE.x, TABLE.t, TABLE.z),
    new THREE.MeshPhysicalMaterial({
      map: walnut(aniso),
      roughness: 0.5,
      specularIntensity: 0.25,
      clearcoat: 0.55,
      clearcoatRoughness: 0.09,
      envMapIntensity: 0.55,
    }),
  );
  table.position.y = -TABLE.t / 2;
  scene.add(table);

  /* The window and one ceiling panel as area lights. The probe already
     carries their light; these add what a probe cannot: a sharp specular
     shape on the lacquer and per-pixel light on the paper's relief. */
  const windowLight = new THREE.RectAreaLight(0xf2f5f8, 1.2, 7, 1.9);
  windowLight.position.set(4, 0.75, 0);
  windowLight.lookAt(0, 0, 0);
  scene.add(windowLight);

  const panel = new THREE.RectAreaLight(0xf3f6ff, 2.2, 0.6, 1.2);
  panel.position.set(-0.4, 2.1, 0.3);
  panel.lookAt(-0.4, 0, 0.3);
  scene.add(panel);

  return {
    table,
    windowLight,
    panel,
    /* a cloud moving off the sun: window and probe brighten together */
    setDaylight(k) {
      windowLight.intensity = 1.2 * k;
      scene.environmentIntensity = 0.85 + 0.15 * k;
      scene.backgroundIntensity = 0.9 + 0.1 * k;
    },
  };
}
