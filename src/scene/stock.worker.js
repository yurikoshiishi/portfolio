/* ------------------------------------------------------------------
   Card stock, made from fields rather than painted.

   The main thread sends the ink and watermark masks (they need the
   typeface, which only the document has). Everything else — the felt of
   the sheet, loose fibres, the bite of the press, salt in the ink, the
   gloss of thermography — is computed here and sent back as two RGBA
   buffers, bottom row first, ready for a DataTexture:

     surface: albedo (sRGB) in RGB, roughness in A
     relief:  tangent-space normal in RGB, watermark in A
   ------------------------------------------------------------------ */

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

/* value noise, one octave, added into out with amplitude amp */
function addNoise(out, W, H, period, amp, seed, stretch = 1) {
  const rand = rng(seed);
  const px = period * stretch;
  const py = period;
  const gw = Math.ceil(W / px) + 2;
  const gh = Math.ceil(H / py) + 2;
  const g = new Float32Array(gw * gh);
  for (let i = 0; i < g.length; i++) g[i] = rand() * 2 - 1;
  for (let y = 0; y < H; y++) {
    const fy = y / py;
    const iy = fy | 0;
    let ty = fy - iy;
    ty = ty * ty * (3 - 2 * ty);
    const r0 = iy * gw;
    const r1 = r0 + gw;
    const row = y * W;
    for (let x = 0; x < W; x++) {
      const fx = x / px;
      const ix = fx | 0;
      let tx = fx - ix;
      tx = tx * tx * (3 - 2 * tx);
      const a = g[r0 + ix] + (g[r0 + ix + 1] - g[r0 + ix]) * tx;
      const b = g[r1 + ix] + (g[r1 + ix + 1] - g[r1 + ix]) * tx;
      out[row + x] += (a + (b - a) * ty) * amp;
    }
  }
}

/* three box passes ≈ a gaussian of the given sigma */
function blur(src, W, H, sigma) {
  const n = 3;
  const wIdeal = Math.sqrt((12 * sigma * sigma) / n + 1);
  let wl = Math.floor(wIdeal);
  if (wl % 2 === 0) wl--;
  const m = Math.round(
    (12 * sigma * sigma - n * wl * wl - 4 * n * wl - 3 * n) / (-4 * wl - 4),
  );
  let a = Float32Array.from(src);
  const b = new Float32Array(src.length);
  for (let i = 0; i < n; i++) {
    const r = ((i < m ? wl : wl + 2) - 1) / 2;
    if (r < 1) continue;
    boxH(a, b, W, H, r);
    boxV(b, a, W, H, r);
  }
  return a;
}
function boxH(s, d, W, H, r) {
  const k = 1 / (r + r + 1);
  for (let y = 0; y < H; y++) {
    const o = y * W;
    const fv = s[o];
    let acc = (r + 1) * fv;
    for (let j = 0; j < r; j++) acc += s[o + Math.min(j, W - 1)];
    for (let x = 0; x < W; x++) {
      acc +=
        s[o + Math.min(x + r, W - 1)] -
        (x - r - 1 >= 0 ? s[o + x - r - 1] : fv);
      d[o + x] = acc * k;
    }
  }
}
function boxV(s, d, W, H, r) {
  const k = 1 / (r + r + 1);
  for (let x = 0; x < W; x++) {
    const fv = s[x];
    let acc = (r + 1) * fv;
    for (let j = 0; j < r; j++) acc += s[Math.min(j, H - 1) * W + x];
    for (let y = 0; y < H; y++) {
      acc +=
        s[Math.min(y + r, H - 1) * W + x] -
        (y - r - 1 >= 0 ? s[(y - r - 1) * W + x] : fv);
      d[y * W + x] = acc * k;
    }
  }
}

/* Loose surface fibres: short, slightly curved strokes a hair proud of the
   sheet, splatted straight into the field. */
function fibres(W, H, pxPerMm, density, seed) {
  const out = new Float32Array(W * H);
  const rand = rng(seed);
  const count = Math.round(((W * H) / 520) * density);
  for (let i = 0; i < count; i++) {
    const x0 = rand() * W;
    const y0 = rand() * H;
    const len = (0.5 + rand() * rand() * 2.8) * pxPerMm;
    const a = rand() * Math.PI;
    const bend = (rand() - 0.5) * 0.9;
    const amp = 0.05 + rand() * 0.16;
    const steps = Math.max(2, Math.ceil(len * 1.5));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps - 0.5;
      const ang = a + bend * t;
      const x = x0 + Math.cos(ang) * len * t;
      const y = y0 + Math.sin(ang) * len * t;
      const ix = x | 0;
      const iy = y | 0;
      if (ix < 0 || iy < 0 || ix >= W - 1 || iy >= H - 1) continue;
      const fx = x - ix;
      const fy = y - iy;
      const o = iy * W + ix;
      out[o] += amp * (1 - fx) * (1 - fy);
      out[o + 1] += amp * fx * (1 - fy);
      out[o + W] += amp * (1 - fx) * fy;
      out[o + W + 1] += amp * fx * fy;
    }
  }
  return out;
}

function smooth(e0, e1, x) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function toFloat(u8) {
  const f = new Float32Array(u8.length);
  for (let i = 0; i < u8.length; i++) f[i] = u8[i] / 255;
  return f;
}

/*
  spec: {
    W, H, cardMm,                  texture size, card width in mm
    paper: [r,g,b], ink: [r,g,b],  sRGB 0-255
    tooth, toothScale, peel,       felt amplitude, felt scale, orange peel
    fibre, formation,              fibre density, cloudiness
    process: 'letterpress' | 'offset' | 'thermo',
    depth,                         impression depth (letterpress)
    inkRough, paperRough,
    seed
  }
*/
function build(spec, inkMask, wmMask) {
  const { W, H, seed } = spec;
  const N = W * H;
  const mm = W / spec.cardMm;

  const tooth = new Float32Array(N);
  const ts = spec.toothScale;
  addNoise(tooth, W, H, 0.09 * mm * ts, 0.5, seed + 1, 1.3);
  addNoise(tooth, W, H, 0.22 * mm * ts, 0.35, seed + 2, 1.5);
  addNoise(tooth, W, H, 0.55 * mm * ts, 0.12, seed + 3, 1.8);
  if (spec.peel) addNoise(tooth, W, H, 0.42 * mm, spec.peel, seed + 4, 1);

  const form = new Float32Array(N);
  addNoise(form, W, H, 2.4 * mm, 0.7, seed + 5, 1.4);
  addNoise(form, W, H, 7 * mm, 0.5, seed + 6, 1.6);

  const fib = spec.fibre ? fibres(W, H, mm, spec.fibre, seed + 7) : null;
  const wm = wmMask ? blur(toFloat(wmMask), W, H, H * 0.0035) : null;

  const ink = toFloat(inkMask);
  const process = spec.process;
  /* the printed area: crisp for offset, slightly spread where ink was pressed or fused */
  const wall = blur(ink, W, H, (process === "offset" ? 0.025 : 0.05) * mm);
  let relief = null;
  let rim = null;
  if (process === "letterpress") {
    const shoulder = blur(ink, W, H, 0.22 * mm);
    relief = new Float32Array(N);
    for (let i = 0; i < N; i++)
      relief[i] = -(wall[i] * 0.85 + shoulder[i] * 0.9) * spec.depth;
    const near = blur(ink, W, H, 0.07 * mm);
    rim = new Float32Array(N);
    for (let i = 0; i < N; i++)
      rim[i] = Math.min(1, Math.max(0, ink[i] - near[i]) * 3);
  } else if (process === "thermo") {
    /* thermography: powder fused on wet ink, a rounded glossy bead */
    const bead = blur(ink, W, H, 0.06 * mm);
    relief = new Float32Array(N);
    for (let i = 0; i < N; i++)
      relief[i] = smooth(0.05, 0.75, bead[i]) * spec.depth;
  }

  const height = new Float32Array(N);
  const surface = new Uint8ClampedArray(N * 4);
  const salt = rng(seed + 9);
  const paper = spec.paper;
  const inkC = spec.ink;
  const toothAmp = spec.tooth;
  const formAmp = spec.formation;

  for (let i = 0; i < N; i++) {
    const t = tooth[i];
    const f = fib ? fib[i] : 0;
    const w = wm ? wm[i] : 0;
    const fo = form[i];
    let cov = 0;
    let flat = 1;
    if (process === "letterpress") {
      flat = 1 - Math.min(1, -relief[i] / spec.depth) * 0.62;
      /* ink does not reach the bottoms of the deepest pores: salt */
      const valley = smooth(0.25, 0.85, -t);
      cov =
        Math.min(1, wall[i] * 1.08) *
        (1 - valley * 0.55 * (0.6 + salt() * 0.4));
    } else if (process === "thermo") {
      cov = Math.min(1, wall[i] * 1.15);
      flat = 1 - cov * 0.85;
    } else {
      cov = Math.min(1, wall[i] * 1.05) * (1 - smooth(0.4, 1, -t) * 0.18);
    }
    height[i] =
      t * toothAmp * flat +
      f * 0.36 * flat +
      fo * 0.06 +
      (relief ? relief[i] : 0) -
      w * 0.08;

    const shade = 1 + fo * formAmp + t * 0.006 + f * 0.012 - w * 0.006;
    const r = rim ? rim[i] : 0;
    const j = i * 4;
    for (let k = 0; k < 3; k++) {
      const ic = inkC[k] * (1 - 0.3 * r);
      surface[j + k] = (paper[k] * (1 - cov) + ic * cov) * shade;
    }
    const pr = spec.paperRough + t * 0.04 - f * 0.06 - w * 0.1;
    surface[j + 3] = (pr + (spec.inkRough - pr) * cov) * 255;
  }

  /* normals from the height field, green up, rows flipped to bottom-first */
  const relief8 = new Uint8ClampedArray(N * 4);
  const out8 = new Uint8ClampedArray(N * 4);
  const s = spec.normalScale;
  for (let y = 0; y < H; y++) {
    const ym = Math.max(0, y - 1) * W;
    const yp = Math.min(H - 1, y + 1) * W;
    const row = y * W;
    const dst = (H - 1 - y) * W;
    for (let x = 0; x < W; x++) {
      const xm = Math.max(0, x - 1);
      const xp = Math.min(W - 1, x + 1);
      const nx = -(height[row + xp] - height[row + xm]) * s;
      const ny = -(height[ym + x] - height[yp + x]) * s;
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
      const j = (dst + x) * 4;
      relief8[j] = (nx * inv * 0.5 + 0.5) * 255;
      relief8[j + 1] = (ny * inv * 0.5 + 0.5) * 255;
      relief8[j + 2] = (inv * 0.5 + 0.5) * 255;
      relief8[j + 3] = (wm ? wm[row + x] : 0) * 255;
      const k = (row + x) * 4;
      out8[j] = surface[k];
      out8[j + 1] = surface[k + 1];
      out8[j + 2] = surface[k + 2];
      out8[j + 3] = surface[k + 3];
    }
  }
  return { surface: out8, relief: relief8 };
}

self.onmessage = (e) => {
  const { id, spec, ink, watermark } = e.data;
  const { surface, relief } = build(spec, ink, watermark);
  self.postMessage({ id, surface, relief }, [surface.buffer, relief.buffer]);
};
