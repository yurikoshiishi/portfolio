/* ------------------------------------------------------------------
   Sound, all synthesised: no files, nothing licensed.

   The room: HVAC rumble, the 120 Hz buzz of fluorescent ballasts, a city
   far below the glass. Paper on lacquer. Then the room drops away and
   leaves a low drone and a pulse.
   ------------------------------------------------------------------ */

function noiseBuffer(ctx, seconds, colour) {
  const n = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < n; i++) {
    const w = Math.random() * 2 - 1;
    if (colour === "brown") {
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    } else d[i] = w;
  }
  return buf;
}

export function createSound() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain();
  master.gain.value = 0;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  master.connect(comp).connect(ctx.destination);

  const white = noiseBuffer(ctx, 2, "white");
  const brown = noiseBuffer(ctx, 4, "brown");
  const now = () => ctx.currentTime;

  function loop(buf) {
    const s = ctx.createBufferSource();
    s.buffer = buf;
    s.loop = true;
    s.start();
    return s;
  }

  /* ---- room tone ---- */
  const room = ctx.createGain();
  room.gain.value = 0;
  room.connect(master);

  const hvac = loop(brown);
  const hvacLp = ctx.createBiquadFilter();
  hvacLp.type = "lowpass";
  hvacLp.frequency.value = 380;
  const hvacG = ctx.createGain();
  hvacG.gain.value = 0.55;
  hvac.connect(hvacLp).connect(hvacG).connect(room);

  const air = loop(white);
  const airBp = ctx.createBiquadFilter();
  airBp.type = "bandpass";
  airBp.frequency.value = 900;
  airBp.Q.value = 0.4;
  const airG = ctx.createGain();
  airG.gain.value = 0.012;
  air.connect(airBp).connect(airG).connect(room);

  for (const [f, g] of [
    [120, 0.006],
    [240, 0.0035],
    [360, 0.0015],
  ]) {
    const o = ctx.createOscillator();
    o.frequency.value = f;
    const og = ctx.createGain();
    og.gain.value = g;
    o.connect(og).connect(room);
    o.start();
  }

  /* the city: low traffic swell, slowly breathing */
  const city = loop(brown);
  const cityLp = ctx.createBiquadFilter();
  cityLp.type = "lowpass";
  cityLp.frequency.value = 160;
  const cityG = ctx.createGain();
  cityG.gain.value = 0.25;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.07;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.12;
  lfo.connect(lfoG).connect(cityG.gain);
  lfo.start();
  city.connect(cityLp).connect(cityG).connect(room);

  /* ---- the drone under the silence ---- */
  const drone = ctx.createGain();
  drone.gain.value = 0;
  const droneLp = ctx.createBiquadFilter();
  droneLp.type = "lowpass";
  droneLp.frequency.value = 320;
  droneLp.Q.value = 0.7;
  droneLp.connect(drone).connect(master);
  for (const [f, type, g] of [
    [55, "sawtooth", 0.18],
    [55.35, "sawtooth", 0.18],
    [82.4, "sine", 0.22],
    [110.2, "triangle", 0.08],
  ]) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const og = ctx.createGain();
    og.gain.value = g;
    o.connect(og).connect(droneLp);
    o.start();
  }
  const ring = ctx.createOscillator();
  ring.frequency.value = 6900;
  const ringG = ctx.createGain();
  ringG.gain.value = 0;
  ring.connect(ringG).connect(master);
  ring.start();

  let heartTimer = null;
  let muted = false;

  function ramp(param, value, seconds) {
    const t = now();
    param.cancelScheduledValues(t);
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(value, t + seconds);
  }

  /* paper sliding on lacquer: a hiss that dies with the card's speed */
  function slide(dur, soft) {
    const t = now();
    const s = ctx.createBufferSource();
    s.buffer = white;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 900;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(3400, t);
    bp.frequency.exponentialRampToValueAtTime(1500, t + dur);
    bp.Q.value = 0.7;
    const g = ctx.createGain();
    const peak = soft ? 0.05 : 0.085;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + 0.025);
    g.gain.setTargetAtTime(0, t + 0.06, dur / 3.2);
    s.connect(hp).connect(bp).connect(g).connect(master);
    s.start(t, Math.random());
    s.stop(t + dur + 0.6);
    /* the card settling: a soft paper tick */
    const k = ctx.createBufferSource();
    k.buffer = white;
    const kb = ctx.createBiquadFilter();
    kb.type = "bandpass";
    kb.frequency.value = 2100;
    kb.Q.value = 1.4;
    const kg = ctx.createGain();
    const at = t + dur * 0.94;
    kg.gain.setValueAtTime(0, at);
    kg.gain.linearRampToValueAtTime(soft ? 0.03 : 0.05, at + 0.004);
    kg.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
    k.connect(kb).connect(kg).connect(master);
    k.start(at, Math.random());
    k.stop(at + 0.08);
  }

  function beat() {
    const t = now();
    for (const [dt, a] of [
      [0, 0.32],
      [0.29, 0.2],
    ]) {
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(62, t + dt);
      o.frequency.exponentialRampToValueAtTime(38, t + dt + 0.14);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t + dt);
      g.gain.linearRampToValueAtTime(a, t + dt + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.22);
      o.connect(g).connect(master);
      o.start(t + dt);
      o.stop(t + dt + 0.3);
    }
  }

  return {
    ctx,
    async start({ muted: m }) {
      muted = m;
      if (ctx.state !== "running") await ctx.resume();
      ramp(master.gain, muted ? 0 : 1, 0.4);
    },
    setMuted(m) {
      muted = m;
      ramp(master.gain, m ? 0 : 1, 0.25);
    },
    get muted() {
      return muted;
    },
    cue(c) {
      switch (c.cue) {
        case "room":
          ramp(room.gain, 1, 2.5);
          ramp(drone.gain, 0, 0.5);
          ramp(ringG.gain, 0, 0.3);
          break;
        case "slide":
          slide(c.dur, c.soft);
          break;
        case "drop":
          ramp(room.gain, 0.06, 1.4);
          ramp(drone.gain, 0.09, 4);
          ramp(ringG.gain, 0.0018, 3);
          break;
        case "heart":
          clearInterval(heartTimer);
          beat();
          heartTimer = setInterval(beat, 1150);
          break;
        case "release":
          clearInterval(heartTimer);
          heartTimer = null;
          ramp(drone.gain, 0, 3);
          ramp(ringG.gain, 0, 1.5);
          ramp(room.gain, 0.7, 4);
          break;
      }
    },
    /* jump straight to the state after the sequence */
    settle() {
      clearInterval(heartTimer);
      heartTimer = null;
      ramp(drone.gain, 0, 0.6);
      ramp(ringG.gain, 0, 0.3);
      ramp(room.gain, 0.7, 1);
    },
  };
}
