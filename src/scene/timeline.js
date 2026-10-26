/* ------------------------------------------------------------------
   The shot list. Times in seconds from Enter; distances in metres with
   the card's resting place at the origin and the window far along +x.

   Each shot is a cut. Inside a shot the camera travels a Catmull-Rom path
   through its keys, so moves ease without stopping at every key. Focus
   is either a fixed distance or "card" (pulled to wherever the card is).
   ------------------------------------------------------------------ */

const REST_YAW = -Math.PI / 2; /* text reads left to right from the camera */

export const SUBTITLES = [
  { t0: 22.5, t1: 25.3, text: "Let’s see Yuri Koshiishi’s card." },
  { t0: 29.8, t1: 32.2, text: "Look at that subtle off-white coloring." },
  { t0: 32.5, t1: 34.6, text: "The tasteful thickness of it." },
  { t0: 35.0, t1: 37.8, text: "Oh my God. It even has a watermark." },
];

/* sound and state cues, fired once as playback crosses them */
export const CUES = [
  { t: 0.0, cue: "room" },
  { t: 5.65, cue: "slide", dur: 1.5 },
  { t: 11.35, cue: "slide", dur: 1.4 },
  { t: 16.95, cue: "slide", dur: 1.3 },
  { t: 22.0, cue: "drop" },
  { t: 26.35, cue: "slide", dur: 2.6, soft: true },
  { t: 29.5, cue: "heart" },
  { t: 38.6, cue: "release" },
];

export const END = 40.5; /* the sequence hands over to the visitor here */
export const HANDOFF = 38.6; /* the letterbox opens, the camera starts home */

/* card slides: from → to over [t0, t1], decelerating like paper on lacquer */
const slide = (card, t0, t1, from, to, yaw0, yaw1) => ({
  card,
  t0,
  t1,
  from,
  to,
  yaw0: REST_YAW + yaw0,
  yaw1: REST_YAW + yaw1,
});

export const SHOTS = [
  {
    /* the room, before anyone speaks */
    t0: 0,
    t1: 5.2,
    card: null,
    keys: [
      { t: 0, pos: [-0.2, 0.1, 0.06], look: [1.6, 0.28, 0.03], fov: 30 },
      { t: 5.2, pos: [-0.13, 0.085, 0.015], look: [1.6, 0.24, 0.0], fov: 29 },
    ],
    focus: { d: 1.4, range: 0.9, bokeh: 1.6 },
  },
  {
    /* Bateman: bone, Silian Rail */
    t0: 5.2,
    t1: 11.0,
    card: slide("bateman", 5.6, 7.15, [0.42, -0.07], [0, 0], 0.28, -0.035),
    keys: [
      { t: 5.2, pos: [-0.24, 0.15, 0.035], look: [0.03, 0, 0.0], fov: 24 },
      { t: 11.0, pos: [-0.205, 0.128, 0.018], look: [0.005, 0, 0.0], fov: 24 },
    ],
    focus: { d: "card", range: 0.055, bokeh: 2.6 },
  },
  {
    /* Van Patten: eggshell, Romalian type — low across the table, focus racking through the type */
    t0: 11.0,
    t1: 16.6,
    card: slide(
      "vanpatten",
      11.3,
      12.75,
      [0.36, 0.13],
      [0, 0.004],
      -0.22,
      0.025,
    ),
    keys: [
      {
        t: 11.0,
        pos: [-0.17, 0.062, -0.05],
        look: [0.012, 0.0, 0.004],
        fov: 26,
      },
      {
        t: 16.6,
        pos: [-0.155, 0.056, -0.018],
        look: [0.008, 0.0, 0.002],
        fov: 26,
      },
    ],
    focus: {
      from: 0.14,
      to: 0.2,
      t0: 13.2,
      t1: 16.2,
      range: 0.022,
      bokeh: 3.4,
    },
  },
  {
    /* McDermott: raised lettering, pale nimbus — from above, the glint travels the type */
    t0: 16.6,
    t1: 22.0,
    card: slide("mcdermott", 16.9, 18.25, [0.3, -0.15], [0, 0], 0.3, -0.02),
    keys: [
      { t: 16.6, pos: [-0.095, 0.205, 0.06], look: [0.0, 0, 0.0], fov: 24 },
      { t: 22.0, pos: [-0.075, 0.18, -0.035], look: [0.0, 0, 0.0], fov: 24 },
    ],
    focus: { d: "card", range: 0.04, bokeh: 2.6 },
  },
  {
    /* the empty place on the table. In the film: "Let's see Paul Allen's card." */
    t0: 22.0,
    t1: 26.0,
    card: null,
    keys: [
      { t: 22.0, pos: [-0.21, 0.1, -0.02], look: [0.35, 0.015, 0.0], fov: 26 },
      { t: 26.0, pos: [-0.19, 0.094, 0.0], look: [0.35, 0.012, 0.0], fov: 26 },
    ],
    focus: { d: 0.42, range: 0.25, bokeh: 3 },
  },
  {
    /* Paul Allen's card */
    t0: 26.0,
    t1: Infinity,
    card: slide("yuri", 26.35, 29.0, [0.6, 0.0], [0, 0], 0.09, -0.018),
    keys: [
      { t: 26.0, pos: [-0.265, 0.13, 0.0], look: [0.06, 0, 0.0], fov: 22 },
      { t: 29.4, pos: [-0.205, 0.102, 0.004], look: [0.0, 0, 0.0], fov: 22 },
      /* the colouring */
      { t: 31.9, pos: [-0.152, 0.074, 0.016], look: [0.0, 0, 0.002], fov: 22 },
      /* the thickness: down at the near edge */
      {
        t: 34.3,
        pos: [-0.072, 0.0085, 0.032],
        look: [-0.024, 0.0003, 0.004],
        fov: 28,
      },
      /* the watermark, catching the window */
      { t: 37.4, pos: [-0.085, 0.15, -0.03], look: [0.004, 0, 0.018], fov: 24 },
      /* home: replaced at runtime by the framing that fits the viewport */
      { t: END, home: true },
    ],
    focus: { d: "card", range: 0.03, bokeh: 3.2, edgeAt: [33.0, 34.9] },
  },
];

/* window light over time: steady, then a cloud clears as the watermark shows */
export function daylight(t) {
  if (t < 34.2) return 1;
  if (t < 35.8) return 1 + 0.55 * smootherstep((t - 34.2) / 1.6);
  return 1.55 - 0.3 * smootherstep(Math.min(1, (t - 35.8) / 3));
}

/* how strongly the watermark shows, 0..1 */
export function watermark(t) {
  if (t < 34.6) return 0.12;
  return 0.12 + 0.88 * smootherstep(Math.min(1, (t - 34.6) / 1.4));
}

export function smootherstep(x) {
  x = Math.min(1, Math.max(0, x));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

export function shotAt(t) {
  for (let i = SHOTS.length - 1; i >= 0; i--) if (t >= SHOTS[i].t0) return i;
  return 0;
}

/* a card sliding to rest: velocity falls off linearly (constant friction) */
export function slidePose(s, t) {
  const u = Math.min(1, Math.max(0, (t - s.t0) / (s.t1 - s.t0)));
  const k = 1 - (1 - u) * (1 - u);
  const yk = 1 - Math.pow(1 - u, 3);
  return {
    x: s.from[0] + (s.to[0] - s.from[0]) * k,
    z: s.from[1] + (s.to[1] - s.from[1]) * k,
    yaw: s.yaw0 + (s.yaw1 - s.yaw0) * yk,
    moving: u > 0 && u < 1,
    visible: t >= s.t0 - 0.0001,
  };
}

function cr(p0, p1, p2, p3, u) {
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * u +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * u2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * u3)
  );
}

/* Camera along a shot's keys. `home` is the resting framing for the end. */
export function cameraAt(shot, t, home) {
  const keys = shot.keys.map((k) => (k.home ? { t: k.t, ...home } : k));
  if (t <= keys[0].t) return keys[0];
  const last = keys[keys.length - 1];
  if (t >= last.t) return last;
  let i = 0;
  while (keys[i + 1].t < t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const p = keys[i - 1] || a;
  const n = keys[i + 2] || b;
  let u = (t - a.t) / (b.t - a.t);
  /* Shots cut in already moving. Only the last move of a long shot
     comes to rest: it leaves its key at full speed and eases to a stop. */
  if (keys.length > 2 && i === keys.length - 2)
    u = 1 - (1 - u) * (1 - u) * (1 + u);
  const lerp3 = (f) =>
    [0, 1, 2].map((j) => cr(p[f][j], a[f][j], b[f][j], n[f][j], u));
  return {
    pos: lerp3("pos"),
    look: lerp3("look"),
    fov: a.fov + (b.fov - a.fov) * u,
  };
}

export function subtitleAt(t) {
  for (const s of SUBTITLES) if (t >= s.t0 && t < s.t1) return s;
  return null;
}
