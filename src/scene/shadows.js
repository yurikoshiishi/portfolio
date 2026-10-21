import * as THREE from "three";

/* ------------------------------------------------------------------
   The card's shadow, rendered from its own geometry onto the table.

   Two passes: an ambient one straight down (the room's sky occlusion)
   and a key one projected along the window light. Each is blurred by how
   high the card is, so the shadow is a hairline while it lies flat and a
   soft pool once it is lifted — what a large soft source does, which a
   shadow map with a fixed kernel cannot.
   ------------------------------------------------------------------ */

const HALF = 0.11; /* half-extent of the shadow canvas, metres */
const KRES = 1024;
const ARES = 256; /* the ambient pool is only ever soft */

export function createShadows(renderer, scene, keyDir) {
  const rtOpts = { type: THREE.HalfFloatType, depthBuffer: false };
  const pair = (res) => [
    new THREE.WebGLRenderTarget(res, res, rtOpts),
    new THREE.WebGLRenderTarget(res, res, rtOpts),
  ];
  const rtA = pair(ARES);
  const rtK = pair(KRES);

  const cam = new THREE.OrthographicCamera(-HALF, HALF, HALF, -HALF, 0.1, 10);
  cam.position.set(0, 5, 0);
  cam.up.set(0, 0, -1);
  cam.lookAt(0, 0, 0);

  const projMat = new THREE.ShaderMaterial({
    uniforms: {
      uL: { value: new THREE.Vector3(0, 1, 0) },
      uFade: { value: 0.05 },
      uOrigin: { value: new THREE.Vector3() },
    },
    vertexShader: /* glsl */ `
      uniform vec3 uL; uniform vec3 uOrigin;
      varying float vH;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        float h = max(wp.y, 0.0);
        vec3 p = wp.xyz - uL * (h / uL.y) - uOrigin;
        p.y = 0.0;
        vH = h;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uFade; varying float vH;
      void main() { float a = clamp(1.0 - vH / uFade, 0.0, 1.0); gl_FragColor = vec4(a, a, a, 1.0); }`,
    blending: THREE.CustomBlending,
    blendEquation: THREE.MaxEquation,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneFactor,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const casterScene = new THREE.Scene();
  const proxy = new THREE.Mesh(undefined, projMat);
  proxy.matrixAutoUpdate = false;
  proxy.frustumCulled = false;
  casterScene.add(proxy);

  const blurMat = new THREE.ShaderMaterial({
    uniforms: { tMap: { value: null }, uStep: { value: new THREE.Vector2() } },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tMap; uniform vec2 uStep; varying vec2 vUv;
      void main() {
        float s = 0.0, wsum = 0.0;
        for (int i = -6; i <= 6; i++) {
          float fi = float(i);
          float w = exp(-fi * fi / 18.0);
          s += texture2D(tMap, vUv + uStep * fi).r * w;
          wsum += w;
        }
        s /= wsum;
        gl_FragColor = vec4(s, s, s, 1.0);
      }`,
    depthTest: false,
    depthWrite: false,
  });
  const quadScene = new THREE.Scene();
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  quadScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), blurMat));

  function pass(rts, L, fade, sigmaMetres, origin) {
    const res = rts[0].width;
    projMat.uniforms.uL.value.copy(L);
    projMat.uniforms.uFade.value = fade;
    projMat.uniforms.uOrigin.value.copy(origin);
    renderer.setRenderTarget(rts[0]);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    renderer.render(casterScene, cam);
    /* ±6 taps at sigma 3 taps; stack passes for wide blurs */
    let remaining = sigmaMetres * (res / (2 * HALF));
    while (remaining > 0.01) {
      const s = Math.min(remaining, 10);
      remaining = Math.sqrt(Math.max(0, remaining * remaining - s * s));
      const step = s / 3 / res;
      blurMat.uniforms.tMap.value = rts[0].texture;
      blurMat.uniforms.uStep.value.set(step, 0);
      renderer.setRenderTarget(rts[1]);
      renderer.render(quadScene, quadCam);
      blurMat.uniforms.tMap.value = rts[1].texture;
      blurMat.uniforms.uStep.value.set(0, step);
      renderer.setRenderTarget(rts[0]);
      renderer.render(quadScene, quadCam);
    }
  }

  const planeMat = new THREE.ShaderMaterial({
    uniforms: {
      tAmb: { value: rtA[0].texture },
      tKey: { value: rtK[0].texture },
      uAmb: { value: 0.62 },
      uKey: { value: 0.38 },
      uInk: { value: new THREE.Color(0.012, 0.009, 0.007) },
    },
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D tAmb, tKey; uniform float uAmb, uKey; uniform vec3 uInk; varying vec2 vUv;
      void main() {
        float a = texture2D(tAmb, vUv).r * uAmb;
        float k = texture2D(tKey, vUv).r * uKey;
        gl_FragColor = vec4(uInk, 1.0 - (1.0 - a) * (1.0 - k));
      }`,
    transparent: true,
    depthWrite: false,
  });
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(HALF * 2, HALF * 2),
    planeMat,
  );
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = 0.00005;
  plane.renderOrder = 1;
  plane.visible = false;
  scene.add(plane);

  const origin = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const last = new THREE.Matrix4();
  let caster = null;

  return {
    setCaster(mesh) {
      caster = mesh;
      plane.visible = !!mesh;
      if (mesh) proxy.geometry = mesh.geometry;
      last.identity();
    },
    /* re-render only when the card has moved */
    update(force = false) {
      if (!caster) return;
      caster.updateMatrixWorld();
      if (!force && last.equals(caster.matrixWorld)) return;
      last.copy(caster.matrixWorld);
      proxy.matrix.copy(caster.matrixWorld);
      proxy.matrixWorld.copy(caster.matrixWorld);
      const p = caster.position;
      origin.set(p.x, 0, p.z);
      plane.position.x = p.x;
      plane.position.z = p.z;
      const h = Math.max(0, p.y);
      const prevTarget = renderer.getRenderTarget();
      pass(rtA, up, 0.035, 0.0012 + h * 0.5, origin);
      pass(rtK, keyDir, 0.12, 0.0004 + h * 0.16, origin);
      renderer.setRenderTarget(prevTarget);
    },
  };
}
