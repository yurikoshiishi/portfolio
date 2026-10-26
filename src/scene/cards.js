import * as THREE from "three";

/* ------------------------------------------------------------------
   The four cards on the table. Same printer, same face, same layout —
   the whole joke is in the differences: stock, process, thickness.
   Units are metres. A US card is 3.5in × 2in.
   ------------------------------------------------------------------ */

export const CARD_W = 0.0889;
export const CARD_H = 0.0508;
const CARD_MM = 88.9;

export const FACE = '"Copperplate Gothic Std", Copperplate, serif';

/* Line metrics are fractions of card height (cap height, baseline) and
   tracking in em, solved against the film prop. */
const PNP = (phone, name) => [
  { s: phone, w: 400, cap: 0.03498, bl: 0.12197, tr: 0.012, at: "left" },
  {
    s: "PIERCE & PIERCE",
    w: 400,
    cap: 0.0406,
    bl: 0.13326,
    tr: -0.006,
    at: "right",
    id: "firm",
  },
  {
    s: "Mergers and Aquisitions",
    w: 400,
    cap: 0.02932,
    bl: 0.17861,
    tr: 0.01,
    at: "right",
    match: "firm",
  },
  { s: name, w: 700, cap: 0.04259, bl: 0.49037, tr: -0.06, at: "mid" },
  {
    s: "Vice President",
    w: 700,
    cap: 0.03385,
    bl: 0.55354,
    tr: -0.09,
    at: "mid",
  },
  {
    s: "358 EXCHANGE PLACE  NEW YORK, N.Y. 10099",
    w: 400,
    cap: 0.03165,
    bl: 0.86411,
    tr: -0.018,
    at: "mid",
  },
  {
    s: "FAX 212 555 6390  TELEX 10 4534",
    w: 400,
    cap: 0.03189,
    bl: 0.91438,
    tr: 0.018,
    at: "mid",
  },
];

export const CARDS = [
  {
    key: "bateman",
    /* "That's bone. And the lettering is something called Silian Rail." */
    lines: PNP("212 555 6342", "Patrick Bateman"),
    thickness: 0.0004,
    stock: {
      paper: [238, 231, 213],
      ink: [40, 36, 32],
      process: "letterpress",
      depth: 1.1,
      tooth: 0.22,
      toothScale: 1.2,
      peel: 0,
      fibre: 0.6,
      formation: 0.012,
      inkRough: 0.62,
      paperRough: 0.86,
      seed: 101,
    },
  },
  {
    key: "vanpatten",
    /* "Eggshell, with Romalian type." The face is the same; the hand is not. */
    lines: [
      {
        s: "212 555 6214",
        w: 400,
        cap: 0.033,
        bl: 0.124,
        tr: 0.03,
        at: "left",
      },
      {
        s: "PIERCE & PIERCE",
        w: 700,
        cap: 0.0382,
        bl: 0.131,
        tr: 0.02,
        at: "right",
        id: "firm",
      },
      {
        s: "Mergers and Aquisitions",
        w: 400,
        cap: 0.0285,
        bl: 0.176,
        tr: 0.0,
        at: "right",
        match: "firm",
      },
      {
        s: "DAVID VAN PATTEN",
        w: 400,
        cap: 0.0405,
        bl: 0.492,
        tr: 0.045,
        at: "mid",
      },
      {
        s: "Vice President",
        w: 400,
        cap: 0.0332,
        bl: 0.553,
        tr: 0.02,
        at: "mid",
      },
      {
        s: "358 EXCHANGE PLACE  NEW YORK, N.Y. 10099",
        w: 400,
        cap: 0.0302,
        bl: 0.866,
        tr: 0.0,
        at: "mid",
      },
      {
        s: "FAX 212 555 6390  TELEX 10 4534",
        w: 400,
        cap: 0.0302,
        bl: 0.913,
        tr: 0.03,
        at: "mid",
      },
    ],
    thickness: 0.00036,
    stock: {
      paper: [240, 237, 226],
      ink: [32, 30, 28],
      process: "offset",
      tooth: 0.16,
      toothScale: 1,
      peel: 0.38,
      fibre: 0.3,
      formation: 0.01,
      inkRough: 0.55,
      paperRough: 0.78,
      seed: 202,
    },
  },
  {
    key: "mcdermott",
    /* "Raised lettering, pale nimbus white." */
    lines: PNP("212 555 6187", "Craig McDermott"),
    thickness: 0.00038,
    stock: {
      paper: [243, 243, 240],
      ink: [24, 24, 26],
      process: "thermo",
      depth: 2.2,
      tooth: 0.1,
      toothScale: 0.9,
      peel: 0,
      fibre: 0.2,
      formation: 0.008,
      inkRough: 0.16,
      paperRough: 0.7,
      seed: 303,
    },
  },
  {
    key: "yuri",
    /* Paul Allen's card. */
    lines: [
      {
        s: "YURIKOSHIISHI.COM",
        w: 400,
        cap: 0.03498,
        bl: 0.12197,
        tr: 0.012,
        at: "left",
        link: "mailto:hello@yurikoshiishi.com",
      },
      {
        s: "KOSHIISHI & CO.",
        w: 400,
        cap: 0.0406,
        bl: 0.13326,
        tr: -0.006,
        at: "right",
        id: "firm",
      },
      {
        s: "Software and Aquisitions",
        w: 400,
        cap: 0.02932,
        bl: 0.17861,
        tr: 0.01,
        at: "right",
        match: "firm",
      },
      {
        s: "Yuri KOSHIISHI",
        w: 700,
        cap: 0.04259,
        bl: 0.49037,
        tr: -0.086,
        at: "mid",
      },
      {
        s: "Vice President",
        w: 700,
        cap: 0.03385,
        bl: 0.55354,
        tr: -0.09,
        at: "mid",
      },
      {
        s: "TOKYO, JAPAN 100-0000",
        w: 400,
        cap: 0.03165,
        bl: 0.86411,
        tr: -0.018,
        at: "mid",
      },
      {
        s: "LINKEDIN YURIKOSHIISHI",
        w: 400,
        cap: 0.03189,
        bl: 0.91438,
        tr: 0.018,
        at: "mid",
        link: "https://www.linkedin.com/in/yurikoshiishi/",
      },
    ],
    /* "The tasteful thickness of it." */
    thickness: 0.00062,
    watermark: true,
    stock: {
      paper: [246, 244, 239],
      ink: [44, 40, 37],
      process: "letterpress",
      depth: 2.6,
      tooth: 0.3,
      toothScale: 1,
      peel: 0,
      fibre: 1,
      formation: 0.011,
      inkRough: 0.5,
      paperRough: 0.9,
      seed: 404,
    },
  },
];

/* ------------------------------------------------------------------
   Masks. Drawn here because only the document has the typeface.
   ------------------------------------------------------------------ */

function context(W, H) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";
  return ctx;
}

function red(ctx, W, H) {
  const d = ctx.getImageData(0, 0, W, H).data;
  const out = new Uint8Array(W * H);
  for (let i = 0, j = 0; i < out.length; i++, j += 4) out[i] = d[j];
  return out;
}

function capRatio(ctx, weight) {
  ctx.font = `${weight} 1000px ${FACE}`;
  const c = ctx.measureText("H").actualBoundingBoxAscent / 1000;
  return c > 0.45 && c < 0.95 ? c : 0.728;
}

/* Tracking without losing the face's kerning: each glyph sits where the
   untracked substring before it ends. */
function drawTracked(ctx, s, x, y, tr) {
  for (let i = 0; i < s.length; i++) {
    const off = i ? ctx.measureText(s.slice(0, i)).width : 0;
    ctx.fillText(s[i], x + off + tr * i, y);
  }
}

function drawInk(card, W, H) {
  const ctx = context(W, H);
  ctx.textBaseline = "alphabetic";
  const capr = { 400: capRatio(ctx, 400), 700: capRatio(ctx, 700) };
  const widths = {};
  const links = [];
  for (const L of card.lines) {
    const size = (L.cap / capr[L.w]) * H;
    ctx.font = `${L.w} ${size}px ${FACE}`;
    let tr = L.tr * size;
    if (L.match && widths[L.match])
      tr = (widths[L.match] - ctx.measureText(L.s).width) / (L.s.length - 1);
    const w = ctx.measureText(L.s).width + tr * (L.s.length - 1);
    if (L.id) widths[L.id] = w;
    const x =
      L.at === "left"
        ? 0.0615 * W
        : L.at === "right"
          ? 0.94 * W - w
          : 0.5 * W - w / 2;
    drawTracked(ctx, L.s, x, L.bl * H, tr);
    if (L.link) {
      /* generous hit box: a line and a half tall, in uv (v up) */
      const top = L.bl * H - L.cap * H * 1.55;
      const bottom = L.bl * H + L.cap * H * 0.6;
      links.push({
        href: L.link,
        label: L.s,
        u0: (x - 0.01 * W) / W,
        u1: (x + w + 0.01 * W) / W,
        v0: 1 - bottom / H,
        v1: 1 - top / H,
      });
    }
  }
  return { mask: red(ctx, W, H), links };
}

/* The watermark: a seal pressed into the wet sheet. Thinner paper, so in
   reflected light it only shows as a change in sheen. */
function drawWatermark(W, H) {
  const ctx = context(W, H);
  ctx.strokeStyle = "#fff";
  const cx = W * 0.745;
  const cy = H * 0.66;
  const R = H * 0.235;
  ctx.lineWidth = H * 0.006;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = H * 0.0025;
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.68, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `700 ${R * 0.78}px ${FACE}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("K", cx, cy + R * 0.04);
  const ring = "KOSHIISHI · & · CO · TOKYO · ";
  ctx.font = `400 ${R * 0.15}px ${FACE}`;
  const step = (Math.PI * 2) / ring.length;
  for (let i = 0; i < ring.length; i++) {
    const a = -Math.PI / 2 + i * step;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * R * 0.84, cy + Math.sin(a) * R * 0.84);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ring[i], 0, 0);
    ctx.restore();
  }
  return red(ctx, W, H);
}

/* ------------------------------------------------------------------
   Generation, off the main thread.
   ------------------------------------------------------------------ */

let workers = null;
let nextId = 0;
const pending = new Map();

function worker() {
  if (!workers) {
    const n = Math.min(
      2,
      Math.max(1, (navigator.hardwareConcurrency || 2) - 1),
    );
    workers = [];
    for (let i = 0; i < n; i++) {
      const w = new Worker(new URL("./stock.worker.js", import.meta.url), {
        type: "module",
      });
      w.onmessage = (e) => {
        const job = pending.get(e.data.id);
        pending.delete(e.data.id);
        job.busy.n--;
        job.resolve(e.data);
      };
      w.busy = { n: 0 };
      workers.push(w);
    }
  }
  return workers.reduce((a, b) => (a.busy.n <= b.busy.n ? a : b));
}

export function releaseWorkers() {
  if (!workers) return;
  for (const w of workers) w.terminate();
  workers = null;
}

/* Resolves to { surface, relief, links } — DataTexture-ready buffers. */
export function generate(card, W) {
  const H = Math.round((W * CARD_H) / CARD_W);
  const { mask, links } = drawInk(card, W, H);
  const watermark = card.watermark ? drawWatermark(W, H) : null;
  const spec = {
    ...card.stock,
    W,
    H,
    cardMm: CARD_MM,
    normalScale: (1.5 * W) / 3072,
  };
  return new Promise((resolve) => {
    const id = nextId++;
    const w = worker();
    w.busy.n++;
    pending.set(id, {
      resolve: (d) => resolve({ ...d, W, H, links }),
      busy: w.busy,
    });
    const transfer = [mask.buffer];
    if (watermark) transfer.push(watermark.buffer);
    w.postMessage({ id, spec, ink: mask, watermark }, transfer);
  });
}

/* ------------------------------------------------------------------
   Mesh
   ------------------------------------------------------------------ */

function dataTexture(data, W, H, srgb, aniso) {
  const t = new THREE.DataTexture(
    data,
    W,
    H,
    THREE.RGBAFormat,
    THREE.UnsignedByteType,
  );
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = aniso;
  t.needsUpdate = true;
  return t;
}

/* The face reads roughness from the albedo's alpha and the watermark from
   the normal map's alpha, so a card is two textures, not four. */
function faceMaterial(maps, aniso) {
  const uWm = { value: 0 };
  const m = new THREE.MeshPhysicalMaterial({
    map: dataTexture(maps.surface, maps.W, maps.H, true, aniso),
    normalMap: dataTexture(maps.relief, maps.W, maps.H, false, aniso),
    roughness: 1,
    metalness: 0,
    sheen: 0.35,
    sheenRoughness: 0.75,
    sheenColor: new THREE.Color(0xffffff),
    envMapIntensity: 1,
  });
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uWm = uWm;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform float uWm;")
      .replace(
        "#include <map_fragment>",
        `#ifdef USE_MAP
           vec4 surfaceSample = texture2D( map, vMapUv );
           diffuseColor.rgb *= surfaceSample.rgb;
         #endif`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `float roughnessFactor = roughness * surfaceSample.a;
         float wmk = texture2D( normalMap, vNormalMapUv ).a * uWm;
         roughnessFactor = mix( roughnessFactor, roughnessFactor * 0.45, wmk );
         diffuseColor.rgb *= 1.0 - wmk * 0.045;`,
      );
  };
  m.userData.uWm = uWm;
  return m;
}

export function cardMesh(card, maps, aniso) {
  const T = card.thickness;
  const geo = new THREE.BoxGeometry(CARD_W, CARD_H, T, 120, 70, 1);
  const p = geo.attributes.position;
  /* the long edges curl up a fraction of a millimetre */
  const bow = 0.00038;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) / (CARD_W / 2);
    const y = p.getY(i) / (CARD_H / 2);
    p.setZ(
      i,
      p.getZ(i) + bow * (x * x * 0.85 + y * y * 0.15) + bow * 0.12 * x * y,
    );
  }
  geo.rotateX(-Math.PI / 2); /* face up, top edge toward -z */
  geo.computeVertexNormals();
  geo.computeBoundingBox();

  const [r, g, b] = card.stock.paper;
  const paper = new THREE.Color().setRGB(
    r / 255,
    g / 255,
    b / 255,
    THREE.SRGBColorSpace,
  );
  const edge = new THREE.MeshStandardMaterial({
    color: paper.clone().multiplyScalar(0.9),
    roughness: 0.95,
  });
  const back = new THREE.MeshStandardMaterial({ color: paper, roughness: 0.9 });
  const face = faceMaterial(maps, aniso);
  /* BoxGeometry groups: +x, -x, +y, -y, +z (face), -z (back) */
  const mesh = new THREE.Mesh(geo, [edge, edge, edge, edge, face, back]);
  mesh.userData = { card, links: maps.links, face, thickness: T };
  return mesh;
}

/* The card in the lacquer: the same geometry mirrored through the table
   top, added onto the table before the card itself is drawn. What shows
   is the cut edge, bright, and the underside, in its own shadow; how much
   shows is the lacquer's Fresnel. */
export function mirrorMesh(mesh) {
  const [r, g, b] = mesh.userData.card.stock.paper;
  const paper = new THREE.Color().setRGB(
    r / 255,
    g / 255,
    b / 255,
    THREE.SRGBColorSpace,
  );
  const lift = { value: 0 };
  const mat = (k) =>
    new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: paper.clone().multiplyScalar(k) },
        uLift: lift,
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorld;
        void main() {
          vec4 w = modelMatrix * vec4(position, 1.0);
          vWorld = w.xyz;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uLift;
        varying vec3 vWorld;
        void main() {
          float c = abs(normalize(cameraPosition - vWorld).y);
          float F = 0.04 + 0.96 * pow(1.0 - c, 5.0);
          /* the coat is not a mirror: the image softens and fades with height */
          float fade = exp(-max(0.0, -vWorld.y) / 0.04);
          gl_FragColor = vec4(uColor * F * fade * (1.0 - 0.5 * uLift), 1.0);
        }`,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
    });
  const edge = mat(0.75);
  const under = mat(0.1);
  const m = new THREE.Mesh(mesh.geometry, [
    edge,
    edge,
    edge,
    edge,
    under,
    under,
  ]);
  m.matrixAutoUpdate = false;
  m.renderOrder = -1;
  m.visible = false;
  m.userData.lift = lift;
  return m;
}

export function disposeCard(mesh) {
  mesh.geometry.dispose();
  for (const m of new Set(mesh.material)) {
    m.map?.dispose();
    m.normalMap?.dispose();
    m.dispose();
  }
}
