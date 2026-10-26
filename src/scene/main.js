import * as THREE from "three";
import {
  CARDS,
  CARD_H,
  CARD_W,
  FACE,
  cardMesh,
  generate,
  mirrorMesh,
  releaseWorkers,
} from "./cards.js";
import { buildRoom } from "./room.js";
import { createShadows } from "./shadows.js";
import { createPost } from "./post.js";
import { createSound } from "./sound.js";
import {
  CUES,
  END,
  HANDOFF,
  SHOTS,
  cameraAt,
  daylight,
  shotAt,
  slidePose,
  smootherstep,
  subtitleAt,
  watermark,
} from "./timeline.js";

const $ = (id) => document.getElementById(id);
const root = document.documentElement;
const canvas = $("gl");
const statusEl = $("boot-status");
const subtitleEl = $("subtitle");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = matchMedia("(pointer: coarse)").matches;
const mobile = coarse || Math.min(screen.width, screen.height) < 700;
const params = new URLSearchParams(location.search);
const seekTo = parseFloat(params.get("seek") || "");
const rawFrame = params.has("raw"); /* debugging: skip post-processing */

/* ------------------------------------------------------------------
   Renderer. No WebGL2, no film: the flat card is the same joke.
   ------------------------------------------------------------------ */
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    stencil: false,
    powerPreference: "high-performance",
  });
  if (!renderer.capabilities.isWebGL2) throw new Error("WebGL2 required");
} catch (e) {
  location.replace("/card.html");
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
const aniso = renderer.capabilities.getMaxAnisotropy();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(24, 1, 0.004, 60);
const post = createPost(renderer, scene, camera, { mobile });
const keyDir = new THREE.Vector3(
  0.62,
  0.74,
  0.12,
).normalize(); /* toward the window, above */
const shadows = createShadows(renderer, scene, keyDir);
let room = null;
const meshes = {};

/* ------------------------------------------------------------------
   Framing
   ------------------------------------------------------------------ */
const HOME_ELEV = THREE.MathUtils.degToRad(58);
const HOME_FOV = 24;
let home = { pos: [-0.2, 0.3, 0], look: [0, 0, 0], fov: HOME_FOV };
let aspect = 1;

/* Shots are composed for 16:9. On narrower screens keep most of the
   horizontal coverage and let the frame grow taller instead. */
function lensFov(fov16x9) {
  const ref = 16 / 9;
  if (aspect >= ref) return fov16x9;
  const h =
    Math.atan(Math.tan(THREE.MathUtils.degToRad(fov16x9) / 2) * ref) * 0.86;
  const v = 2 * Math.atan(Math.tan(h) / aspect);
  return Math.min(78, THREE.MathUtils.radToDeg(v));
}

function fitHome() {
  const vfov = THREE.MathUtils.degToRad(lensFov(HOME_FOV));
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
  const wantW = aspect < 0.8 ? 0.84 : 0.5;
  const dW = CARD_W / wantW / (2 * Math.tan(hfov / 2));
  const dH =
    (CARD_H * Math.sin(HOME_ELEV) + 0.006) / 0.52 / (2 * Math.tan(vfov / 2));
  const d = Math.max(dW, dH);
  home = {
    pos: [-Math.cos(HOME_ELEV) * d, Math.sin(HOME_ELEV) * d, 0],
    look: [0.002, 0, 0],
    fov: HOME_FOV,
  };
}

function resize() {
  const w = innerWidth;
  const h = innerHeight;
  aspect = w / h;
  renderer.setSize(w, h, false);
  post.setSize(w, h);
  camera.aspect = aspect;
  fitHome();
  root.style.setProperty(
    "--lb",
    aspect >= 1 ? `max(0px, calc((100svh - 100vw / 2.39) / 2))` : "11svh",
  );
  needsRender = true;
}

/* ------------------------------------------------------------------
   Clock. Pauses with the tab so the film does not run on unseen.
   ------------------------------------------------------------------ */
let mode = "boot"; /* boot → ready → play → free */
let t = 0;
let lastNow = 0;
let paused = false;
let sound = null;
let firedUpTo = -1;
let needsRender = true;

function startPlayback(from) {
  t = from;
  firedUpTo = from - 0.0001;
  mode = "play";
  root.dataset.mode = "play";
  lastNow = performance.now();
  if (from <= 0.01 && sound) sound.cue({ cue: "room" });
}

function goFree() {
  mode = "free";
  root.dataset.mode = "free";
  subtitleEl.textContent = "";
  subtitleEl.hidden = true;
  sound?.settle();
  rest.x = rest.z = 0;
  rest.yaw = SHOTS[SHOTS.length - 1].card.yaw1;
  needsRender = true;
  try {
    localStorage.setItem("seen-card", "1");
  } catch (e) {}
}

document.addEventListener("visibilitychange", () => {
  paused = document.hidden;
  if (sound) document.hidden ? sound.ctx.suspend() : sound.ctx.resume();
  lastNow = performance.now();
});

/* ------------------------------------------------------------------
   The hero card, once it is the visitor's to handle
   ------------------------------------------------------------------ */
function spring(x, k, z) {
  return { x, v: 0, t: x, k, c: 2 * Math.sqrt(k) * z };
}
const S = {
  lift: spring(0, 90, 0.82),
  pitch: spring(0, 70, 0.7),
  roll: spring(0, 70, 0.7),
  camx: spring(0, 14, 1),
  camz: spring(0, 14, 1),
};
const springs = Object.values(S);
const rest = { x: 0, z: 0, yaw: 0 };
let held = false;

const qa = new THREE.Quaternion();
const qb = new THREE.Quaternion();
const qc = new THREE.Quaternion();
const AX = new THREE.Vector3(1, 0, 0);
const AY = new THREE.Vector3(0, 1, 0);
const AZ = new THREE.Vector3(0, 0, 1);
const corner = new THREE.Vector3();

function settleOnTable(mesh, x, z, lift) {
  const bb = mesh.geometry.boundingBox;
  let minY = Infinity;
  for (let i = 0; i < 8; i++) {
    corner.set(
      i & 1 ? bb.max.x : bb.min.x,
      i & 2 ? bb.max.y : bb.min.y,
      i & 4 ? bb.max.z : bb.min.z,
    );
    corner.applyQuaternion(mesh.quaternion);
    minY = Math.min(minY, corner.y);
  }
  mesh.position.set(x, Math.max(lift, -minY + 0.00001), z);
}

function poseFree(mesh) {
  const l = S.lift.x;
  /* picked up: it comes toward the eye and turns to face it */
  const face = (Math.PI / 2 - HOME_ELEV) * 0.85;
  qa.setFromAxisAngle(AZ, l * face + S.pitch.x);
  qb.setFromAxisAngle(AX, S.roll.x);
  qc.setFromAxisAngle(AY, rest.yaw);
  mesh.quaternion.copy(qa).multiply(qb).multiply(qc);
  const toward = 0.035 * l;
  settleOnTable(
    mesh,
    rest.x - toward * Math.cos(HOME_ELEV),
    rest.z,
    0.022 * l + mesh.userData.thickness / 2,
  );
}

/* ------------------------------------------------------------------
   Frame
   ------------------------------------------------------------------ */
let active = null;
const focusPoint = new THREE.Vector3();
const edgePoint = new THREE.Vector3();
const lookV = new THREE.Vector3();

const MIRROR = new THREE.Matrix4().makeScale(1, -1, 1);
function setActive(mesh) {
  if (active !== mesh) {
    for (const m of Object.values(meshes)) {
      m.visible = m === mesh;
      m.userData.mirror.visible = m === mesh;
    }
    active = mesh;
    shadows.setCaster(mesh);
  }
}

/* keep the reflection under the card it belongs to */
function reflect() {
  if (!active) return;
  active.updateMatrixWorld();
  const mirror = active.userData.mirror;
  /* through .matrix, so the scene's own world update keeps it */
  mirror.matrix.multiplyMatrices(MIRROR, active.matrixWorld);
  mirror.matrixWorld.copy(mirror.matrix);
  mirror.userData.lift.value = Math.min(
    1,
    Math.max(0, active.position.y - 0.001) / 0.02,
  );
}

function applyCamera(c, parallax) {
  camera.position.set(c.pos[0], c.pos[1], c.pos[2]);
  if (parallax) {
    camera.position.z += S.camx.x * 0.012;
    camera.position.x += S.camz.x * 0.008;
  }
  lookV.set(c.look[0], c.look[1], c.look[2]);
  camera.fov = lensFov(c.fov);
  camera.updateProjectionMatrix();
  camera.lookAt(lookV);
}

function frameAt(time) {
  const i = shotAt(time);
  const shot = SHOTS[i];
  let mesh = null;
  if (shot.card) {
    mesh = meshes[shot.card.card];
    const p = slidePose(shot.card, time);
    mesh.quaternion.setFromAxisAngle(AY, p.yaw);
    settleOnTable(mesh, p.x, p.z, mesh.userData.thickness / 2);
  }
  setActive(mesh);

  applyCamera(cameraAt(shot, time, home), false);

  /* focus */
  const f = shot.focus;
  let dist;
  if (f.d === "card" && mesh) {
    focusPoint.copy(mesh.position);
    if (f.edgeAt) {
      /* the near long edge, for "the tasteful thickness of it" */
      const w =
        smootherstep((time - f.edgeAt[0]) / 0.7) *
        (1 - smootherstep((time - f.edgeAt[1]) / 0.7));
      edgePoint
        .set(-CARD_H / 2, 0, 0)
        .applyQuaternion(mesh.quaternion)
        .add(mesh.position);
      focusPoint.lerp(edgePoint, w);
    }
    dist = camera.position.distanceTo(focusPoint);
  } else if (f.from !== undefined) {
    dist =
      f.from + (f.to - f.from) * smootherstep((time - f.t0) / (f.t1 - f.t0));
  } else dist = f.d;
  post.focus(dist, f.range, reduceMotion ? f.bokeh * 0.6 : f.bokeh);

  room.setDaylight(daylight(time));
  meshes.yuri.userData.face.userData.uWm.value = watermark(time);

  const sub = subtitleAt(time);
  const text = sub ? sub.text : "";
  if (subtitleEl.textContent !== text) {
    subtitleEl.textContent = text;
    subtitleEl.hidden = !text;
  }
  reflect();
  shadows.update();
}

function frameFree(dt) {
  let moving = false;
  const sub = 4;
  for (let s = 0; s < sub; s++) {
    const h = dt / sub;
    for (const sp of springs) {
      if (reduceMotion && sp !== S.lift) {
        sp.x += (sp.t - sp.x) * Math.min(1, h * 14);
        sp.v = 0;
      } else {
        sp.v += (sp.k * (sp.t - sp.x) - sp.c * sp.v) * h;
        sp.x += sp.v * h;
      }
    }
  }
  if (S.lift.x < 0) {
    S.lift.x = 0;
    S.lift.v = Math.abs(S.lift.v) * 0.08;
  }
  for (const sp of springs)
    if (Math.abs(sp.t - sp.x) > 1e-4 || Math.abs(sp.v) > 1e-4) moving = true;
  if (!moving && !needsRender) return false;

  const mesh = meshes.yuri;
  setActive(mesh);
  poseFree(mesh);
  applyCamera(home, true);
  post.focus(
    camera.position.distanceTo(mesh.position),
    0.02 + S.lift.x * 0.01,
    2.6,
  );
  room.setDaylight(1.25);
  mesh.userData.face.userData.uWm.value = 0.35 + 0.5 * S.lift.x;
  reflect();
  shadows.update();
  needsRender = false;
  return true;
}

function tick(now) {
  const dt = Math.min(0.05, (now - lastNow) / 1000);
  lastNow = now;
  if (!paused && room) {
    if (mode === "play") {
      t += dt;
      for (const c of CUES) if (c.t > firedUpTo && c.t <= t) sound?.cue(c);
      firedUpTo = t;
      if (t >= END) goFree();
      else {
        frameAt(t);
        rawFrame ? renderer.render(scene, camera) : post.render(dt);
      }
      if (t >= HANDOFF) root.dataset.handoff = "1";
    }
    if (mode === "free" && frameFree(dt)) post.render(dt);
  }
  requestAnimationFrame(tick);
}

/* ------------------------------------------------------------------
   Input, once the card is the visitor's
   ------------------------------------------------------------------ */
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let downAt = null;
let holdTimer = null;

function linkAt(e) {
  const mesh = meshes.yuri;
  if (!mesh) return null;
  ndc.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObject(mesh, false)[0];
  if (!hit || hit.face.materialIndex !== 4) return null;
  const { x: u, y: v } = hit.uv;
  return (
    mesh.userData.links.find(
      (l) => u >= l.u0 && u <= l.u1 && v >= l.v0 && v <= l.v1,
    ) || null
  );
}

function setTilt(e) {
  const nx = (e.clientX / innerWidth) * 2 - 1;
  const ny = (e.clientY / innerHeight) * 2 - 1;
  S.pitch.t = ny * 0.38;
  S.roll.t = nx * 0.45;
}

function pickUp() {
  held = true;
  S.lift.t = 1;
  canvas.classList.add("held");
  root.dataset.touched = "1";
}

function drop() {
  held = false;
  S.lift.t = 0;
  S.pitch.t = 0;
  S.roll.t = 0;
  /* it never lands exactly where it was */
  rest.x = (Math.random() - 0.5) * 0.004;
  rest.z = (Math.random() - 0.5) * 0.006;
  rest.yaw = SHOTS[SHOTS.length - 1].card.yaw1 + (Math.random() - 0.5) * 0.04;
  canvas.classList.remove("held");
}

canvas.addEventListener("pointerdown", (e) => {
  if (mode !== "free") return;
  canvas.setPointerCapture(e.pointerId);
  downAt = { x: e.clientX, y: e.clientY, link: linkAt(e) };
  setTilt(e);
  holdTimer = setTimeout(pickUp, downAt.link ? 260 : 120);
});
canvas.addEventListener("pointermove", (e) => {
  if (mode !== "free") return;
  if (held) setTilt(e);
  else if (
    downAt &&
    Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 8
  ) {
    clearTimeout(holdTimer);
    pickUp();
    setTilt(e);
  }
  if (!held && !downAt) canvas.style.cursor = linkAt(e) ? "pointer" : "";
  if (!reduceMotion && e.pointerType === "mouse") {
    S.camx.t = (e.clientX / innerWidth) * 2 - 1;
    S.camz.t = (e.clientY / innerHeight) * 2 - 1;
  }
});
function release() {
  clearTimeout(holdTimer);
  if (held) drop();
  else if (downAt?.link) {
    const l = downAt.link;
    if (l.href.startsWith("mailto:")) location.href = l.href;
    else window.open(l.href, "_blank", "noopener");
  }
  downAt = null;
}
canvas.addEventListener("pointerup", release);
canvas.addEventListener("pointercancel", () => {
  clearTimeout(holdTimer);
  downAt = null;
  if (held) drop();
});
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

/* ------------------------------------------------------------------
   Controls
   ------------------------------------------------------------------ */
function enter(muted) {
  root.dataset.mode = "play";
  $("boot").classList.add("gone");
  canvas.classList.add("on");
  if (!sound) sound = createSound();
  sound?.start({ muted });
  updateSoundButton();
  if (reduceMotion) {
    startPlayback(END);
    goFree();
    root.dataset.handoff = "1";
  } else startPlayback(isFinite(seekTo) ? seekTo : 0);
}

function skip() {
  if (mode !== "play") return;
  root.dataset.handoff = "1";
  goFree();
}

function replay() {
  delete root.dataset.handoff;
  delete root.dataset.touched;
  S.lift.x = S.lift.t = 0;
  S.lift.v = 0;
  S.pitch.x = S.pitch.t = S.roll.x = S.roll.t = 0;
  startPlayback(0);
}

function updateSoundButton() {
  const b = $("sound");
  const off = !sound || sound.muted;
  b.textContent = off ? "Sound off" : "Sound on";
  b.setAttribute("aria-pressed", String(!off));
}

$("enter").addEventListener("click", () => enter(false));
$("enter-muted").addEventListener("click", () => enter(true));
$("skip").addEventListener("click", skip);
$("replay").addEventListener("click", replay);
$("sound").addEventListener("click", () => {
  if (!sound) sound = createSound();
  if (!sound) return;
  if (sound.ctx.state !== "running") sound.start({ muted: false });
  else sound.setMuted(!sound.muted);
  updateSoundButton();
});
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mode === "play") skip();
});
addEventListener("resize", resize);

/* ------------------------------------------------------------------
   Boot: the room comes over the wire, the cards come off the press.
   ------------------------------------------------------------------ */
async function boot() {
  resize();
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`400 40px ${FACE}`),
        document.fonts.load(`700 40px ${FACE}`),
      ]),
      new Promise((r) => setTimeout(r, 3000)),
    ]);
  } catch (e) {}

  let roomFrac = 0;
  let printed = 0;
  const show = () => {
    const pct = Math.round(((roomFrac + printed) / (1 + CARDS.length)) * 100);
    statusEl.textContent = `At the printer’s — ${pct}%`;
  };
  show();

  const roomP = buildRoom(renderer, scene, "/scene/room.hdr", (e) => {
    if (e.total) roomFrac = e.loaded / e.total;
    show();
  }).then((r) => {
    roomFrac = 1;
    show();
    return r;
  });

  const heroW = mobile ? 2048 : 3072;
  const restW = mobile ? 1024 : 2048;
  const order = ["yuri", "bateman", "vanpatten", "mcdermott"];
  const cardsP = Promise.all(
    order.map((key) => {
      const card = CARDS.find((c) => c.key === key);
      return generate(card, key === "yuri" ? heroW : restW).then((maps) => {
        const m = cardMesh(card, maps, aniso);
        m.visible = false;
        m.userData.mirror = mirrorMesh(m);
        meshes[key] = m;
        scene.add(m, m.userData.mirror);
        printed++;
        show();
      });
    }),
  );

  room = await roomP;
  await cardsP;
  releaseWorkers();

  /* upload everything now, not on the first frame of the film */
  frameAt(0);
  for (const m of Object.values(meshes))
    m.visible = m.userData.mirror.visible = true;
  renderer.compile(scene, camera);
  for (const m of Object.values(meshes))
    m.visible = m.userData.mirror.visible = false;
  post.render(0);

  let seen = false;
  try {
    seen = localStorage.getItem("seen-card") === "1";
  } catch (e) {}
  statusEl.textContent = "Picked them up from the printer’s yesterday.";
  root.dataset.mode = "ready";
  if (seen) $("skip").textContent = "Skip to the card";
  $("enter").focus({ preventScroll: true });
  lastNow = performance.now();
  requestAnimationFrame(tick);
}

boot().catch((e) => {
  console.error(e);
  location.replace("/card.html");
});
