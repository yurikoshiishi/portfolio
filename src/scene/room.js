import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/* ------------------------------------------------------------------
   The meeting room. The far room is one path-traced probe
   (tools/blender/room.py). It lights the cards, and it is projected back
   onto a box the size of the real room from the point it was captured,
   so the walls sit at their true distance: the lens blurs the chairs
   less than the window behind them, as a real one would.

   Only the table is modelled here. It is the one surface the camera
   ever focuses on besides the cards.

   Axes: table top at y = 0, the window wall at x = +4, the table runs
   along z. Blender's (x, y, z) is (z, x, y + 0.74) here.
   ------------------------------------------------------------------ */

const TABLE = { x: 1.3, z: 4.6, t: 0.042 };
const ROOM = { x0: -4, x1: 4.05, y0: -0.74, y1: 2.16, z0: -5, z1: 5 };
const CAPTURE = new THREE.Vector3(0, 0.06, 0);

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

/* periodic value noise, so the tiles meet without a seam */
function tileNoise(W, H, cellsX, cellsY, seed) {
  const rand = rng(seed);
  const g = new Float32Array(cellsX * cellsY);
  for (let i = 0; i < g.length; i++) g[i] = rand() * 2 - 1;
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const fy = (y / H) * cellsY;
    const iy = Math.floor(fy);
    let ty = fy - iy;
    ty = ty * ty * (3 - 2 * ty);
    const r0 = (iy % cellsY) * cellsX;
    const r1 = ((iy + 1) % cellsY) * cellsX;
    for (let x = 0; x < W; x++) {
      const fx = (x / W) * cellsX;
      const ix = Math.floor(fx);
      let tx = fx - ix;
      tx = tx * tx * (3 - 2 * tx);
      const i0 = ix % cellsX;
      const i1 = (ix + 1) % cellsX;
      const a = g[r0 + i0] + (g[r0 + i1] - g[r0 + i0]) * tx;
      const b = g[r1 + i0] + (g[r1 + i1] - g[r1 + i0]) * tx;
      out[y * W + x] = a + (b - a) * ty;
    }
  }
  return out;
}

function canvasTexture(W, H, data, srgb, aniso, repeat) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  c.getContext("2d").putImageData(new ImageData(data, W, H), 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = aniso;
  return t;
}

/* Quarter-sawn walnut under a deep lacquer. One tile is 0.6 m of board;
   the grain runs along v (the length of the table). */
const WOOD_M = 0.6;
function walnut(aniso) {
  const W = 1024;
  const H = 2048;
  const n = W * H;
  /* growth rings: a field stretched hard along the grain, folded into bands */
  const ring = tileNoise(W, H, 48, 3, 11);
  const wave = tileNoise(W, H, 6, 2, 12);
  const figure = tileNoise(W, H, 5, 9, 13);
  const fine = tileNoise(W, H, 320, 24, 14);
  const rand = rng(15);
  const pores = new Float32Array(n);
  /* pores: short dark dashes along the grain */
  const count = 26000;
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * W);
    const y0 = Math.floor(rand() * H);
    const len = 4 + Math.floor(rand() * 14);
    const d = 0.35 + rand() * 0.5;
    for (let k = 0; k < len; k++) pores[((y0 + k) % H) * W + x] = d;
  }
  const data = new Uint8ClampedArray(n * 4);
  for (let i = 0; i < n; i++) {
    const r = ring[i] * 9 + wave[i] * 3.5;
    const band = 0.5 + 0.5 * Math.sin(r * Math.PI);
    const k =
      0.78 + band * 0.24 + figure[i] * 0.12 + fine[i] * 0.05 - pores[i] * 0.32;
    const j = i * 4;
    data[j] = 58 * k;
    data[j + 1] = 37 * k;
    data[j + 2] = 25 * k;
    data[j + 3] = 255;
  }
  return canvasTexture(W, H, data, true, aniso, [
    TABLE.x / WOOD_M,
    TABLE.z / WOOD_M,
  ]);
}

/* The lacquer's own surface: a faint orange peel, hairline scratches from
   years of folders, and smudges where hands rest. Normal in RGB, the
   coat's roughness in G of a second texture. */
const COAT_M = 0.3;
function lacquer(aniso) {
  const S = 1024;
  const n = S * S;
  const peel = tileNoise(S, S, 140, 140, 21);
  const peel2 = tileNoise(S, S, 60, 60, 22);
  const h = new Float32Array(n);
  for (let i = 0; i < n; i++) h[i] = peel[i] * 0.05 + peel2[i] * 0.02;
  const rand = rng(23);
  for (let s = 0; s < 70; s++) {
    let x = rand() * S;
    let y = rand() * S;
    const a = rand() * Math.PI;
    const len = 20 + rand() * rand() * 420;
    const depth = 0.03 + rand() * 0.07;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    for (let k = 0; k < len; k++) {
      const ix = ((Math.round(x) % S) + S) % S;
      const iy = ((Math.round(y) % S) + S) % S;
      h[iy * S + ix] -= depth;
      x += dx;
      y += dy;
    }
  }
  const nData = new Uint8ClampedArray(n * 4);
  const scale = 0.9;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = y * S + x;
      const dx =
        (h[y * S + ((x + 1) % S)] - h[y * S + ((x - 1 + S) % S)]) * scale;
      const dy =
        (h[((y - 1 + S) % S) * S + x] - h[((y + 1) % S) * S + x]) * scale;
      const inv = 1 / Math.sqrt(dx * dx + dy * dy + 1);
      const j = i * 4;
      nData[j] = (-dx * inv * 0.5 + 0.5) * 255;
      nData[j + 1] = (-dy * inv * 0.5 + 0.5) * 255;
      nData[j + 2] = (inv * 0.5 + 0.5) * 255;
      nData[j + 3] = 255;
    }
  }
  const smudge = tileNoise(S, S, 7, 7, 24);
  const smudge2 = tileNoise(S, S, 23, 23, 25);
  const rData = new Uint8ClampedArray(n * 4);
  for (let i = 0; i < n; i++) {
    const m = Math.max(0, smudge[i] * 0.8 + smudge2[i] * 0.4 - 0.25);
    const r = 0.035 + m * 0.22;
    const j = i * 4;
    rData[j] = rData[j + 1] = rData[j + 2] = r * 255;
    rData[j + 3] = 255;
  }
  const rep = [TABLE.x / COAT_M, TABLE.z / COAT_M];
  return {
    normal: canvasTexture(S, S, nData, false, aniso, rep),
    rough: canvasTexture(S, S, rData, false, aniso, rep),
  };
}

/* The probe, painted back onto the walls it was rendered from. */
function roomShell(hdr) {
  const size = new THREE.Vector3(
    ROOM.x1 - ROOM.x0,
    ROOM.y1 - ROOM.y0,
    ROOM.z1 - ROOM.z0,
  );
  const geo = new THREE.BoxGeometry(size.x, size.y, size.z);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      tEnv: { value: hdr },
      uCapture: { value: CAPTURE },
      uIntensity: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vWorld;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tEnv;
      uniform vec3 uCapture;
      uniform float uIntensity;
      varying vec3 vWorld;
      void main() {
        vec3 d = normalize(vWorld - uCapture);
        vec2 uv = vec2(atan(d.z, d.x) * 0.15915494 + 0.5, asin(clamp(d.y, -1.0, 1.0)) * 0.31830989 + 0.5);
        gl_FragColor = vec4(texture2D(tEnv, uv).rgb * uIntensity, 1.0);
      }`,
    side: THREE.BackSide,
    depthWrite: true,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(
    (ROOM.x0 + ROOM.x1) / 2,
    (ROOM.y0 + ROOM.y1) / 2,
    (ROOM.z0 + ROOM.z1) / 2,
  );
  mesh.renderOrder = -10;
  return mesh;
}

export async function buildRoom(renderer, scene, url, onProgress) {
  RectAreaLightUniformsLib.init();
  const aniso = renderer.capabilities.getMaxAnisotropy();

  const hdr = await new RGBELoader().loadAsync(url, onProgress);
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(hdr).texture;
  pmrem.dispose();

  scene.background = null;
  scene.environment = env;
  scene.environmentIntensity = 1;
  const shell = roomShell(hdr);
  scene.add(shell);

  const coat = lacquer(aniso);
  const table = new THREE.Mesh(
    new RoundedBoxGeometry(TABLE.x, TABLE.t, TABLE.z, 4, 0.01),
    new THREE.MeshPhysicalMaterial({
      map: walnut(aniso),
      roughness: 0.55,
      specularIntensity: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 1,
      clearcoatRoughnessMap: coat.rough,
      clearcoatNormalMap: coat.normal,
      clearcoatNormalScale: new THREE.Vector2(0.05, 0.05),
      envMapIntensity: 0.6,
    }),
  );
  table.position.y = -TABLE.t / 2;
  table.renderOrder = -2;
  scene.add(table);

  /* The window and one troffer as area lights. The probe already carries
     their light; these add what a probe cannot: a sharp specular shape on
     the lacquer and per-pixel light on the paper's relief. */
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
    /* a cloud moving off the sun: window, probe and walls brighten together */
    setDaylight(k) {
      windowLight.intensity = 1.2 * k;
      scene.environmentIntensity = 0.85 + 0.15 * k;
      shell.material.uniforms.uIntensity.value = 0.9 + 0.1 * k;
    },
  };
}
