import * as THREE from "three";
import {
  BloomEffect,
  DepthOfFieldEffect,
  Effect,
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  ToneMappingEffect,
  ToneMappingMode,
  VignetteEffect,
} from "postprocessing";

/* A print-film grade, applied to the scene-linear image before tone
   mapping: a touch of desaturation, cool in the shadows, cream in the
   highlights, blacks that never quite reach zero. */
class GradeEffect extends Effect {
  constructor() {
    super(
      "GradeEffect",
      /* glsl */ `
      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec3 c = inputColor.rgb;
        float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
        c = mix(vec3(l), c, 0.86);
        vec3 shadows = vec3(0.975, 1.0, 1.03);
        vec3 highs = vec3(1.035, 1.0, 0.955);
        c *= mix(shadows, highs, smoothstep(0.02, 1.4, l));
        c = c * 0.985 + 0.0025;
        outputColor = vec4(c, inputColor.a);
      }`,
    );
  }
}

export function createPost(renderer, scene, camera, { mobile }) {
  const composer = new EffectComposer(renderer, {
    frameBufferType: THREE.HalfFloatType,
  });
  composer.addPass(new RenderPass(scene, camera));

  const dof = new DepthOfFieldEffect(camera, {
    worldFocusDistance: 0.25,
    worldFocusRange: 0.02,
    bokehScale: 3,
    resolutionScale: mobile ? 0.5 : 0.75,
  });
  dof.target = null;

  const bloom = new BloomEffect({
    intensity: 0.55,
    luminanceThreshold: 0.92,
    luminanceSmoothing: 0.3,
    mipmapBlur: true,
    radius: 0.78,
  });
  const vignette = new VignetteEffect({ offset: 0.32, darkness: 0.42 });
  const grade = new GradeEffect();
  const tone = new ToneMappingEffect({ mode: ToneMappingMode.AGX });

  composer.addPass(new EffectPass(camera, dof, grade, bloom, vignette, tone));
  composer.addPass(new EffectPass(camera, new SMAAEffect()));

  return {
    composer,
    /* focus in metres from the lens; range is the depth held sharp */
    focus(distance, range, bokeh) {
      dof.cocMaterial.worldFocusDistance = distance;
      dof.cocMaterial.worldFocusRange = range;
      dof.bokehScale = bokeh;
    },
    setSize(w, h) {
      composer.setSize(w, h);
    },
    render(dt) {
      composer.render(dt);
    },
  };
}
