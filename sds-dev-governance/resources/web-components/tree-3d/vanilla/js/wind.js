/**
 * The wind, in the vertex shader: nothing is moved on the CPU. Wood and leaves share one slow sway, a function of
 * where a point stands in the tree (so a leaf never leaves its twig) that grows with the square of its height; each
 * leaf also flutters about its base with a phase of its own, in passing gusts. The same patch opens the leaves as
 * the tree grows (`uGrow`) and gives each leaf its lobe's normal, so the foliage shades as a mass, not as cards.
 * A third patch flies the leaves the breeze tears off: each one's place is a function of time and of its own
 * phase — it lets go slowly, gathers speed along the breeze, weaves and tumbles, and fades before it lands.
 */
import { Vector3 } from "three";
export function windUniforms() {
    return {
        uTime: { value: 0 },
        uStrength: { value: 1 },
        uSway: { value: 0.05 },
        uFlutter: { value: 0.3 },
        uFlutterSpeed: { value: 2 },
        uHeight: { value: 4 },
        uGrow: { value: 1 },
        uNormalBlend: { value: 0.7 },
        uFall: { value: 1 },
        uFallDir: { value: new Vector3(-1, -0.6, 0.2).normalize() },
        uFallDist: { value: 3 },
        uTumble: { value: 0.5 },
        uDrift: { value: 0.2 },
    };
}
const HEAD = /* glsl */ `
uniform float uTime;
uniform float uStrength;
uniform float uSway;
uniform float uFlutter;
uniform float uFlutterSpeed;
uniform float uHeight;
uniform float uGrow;
uniform float uNormalBlend;
vec3 treeSway(vec3 p) {
  float h = clamp(p.y / uHeight, 0.0, 1.2);
  float a = h * h * uSway * uHeight * uStrength;
  return vec3(
    sin(uTime * 0.83 + p.x * 0.35) * 0.7 + sin(uTime * 0.31 + 1.7) * 0.5,
    0.0,
    cos(uTime * 0.67 + p.z * 0.4) * 0.45
  ) * a;
}
`;
const LEAF_HEAD = /* glsl */ `
attribute vec3 aOutward;
attribute vec2 aLeaf;
`;
const LEAF_BEGIN = /* glsl */ `
vec3 transformed = vec3(position);
{
  vec3 at = instanceMatrix[3].xyz;
  float gust = 0.55 + 0.45 * sin(uTime * 0.37 + at.x * 0.9 + at.y * 0.45);
  float f = sin(uTime * uFlutterSpeed + aLeaf.x) * uFlutter * gust * uStrength;
  transformed.z += f * transformed.y;
  transformed.x += f * 0.4 * transformed.y * cos(aLeaf.x);
  transformed *= smoothstep(0.3 + aLeaf.y * 0.4, 0.6 + aLeaf.y * 0.4, uGrow);
}
`;
const FALL_HEAD = /* glsl */ `
attribute vec3 aStart;
attribute vec4 aFall;
uniform float uFall;
uniform vec3 uFallDir;
uniform float uFallDist;
uniform float uTumble;
uniform float uDrift;
mat3 fallTurn() {
  float a = (uTime * uTumble * (0.6 + aFall.z) + aFall.z * 40.0) * 6.2832;
  float b = a * 0.63 + aFall.z * 9.0;
  float ca = cos(a), sa = sin(a), cb = cos(b), sb = sin(b);
  return mat3(ca, 0.0, -sa, 0.0, 1.0, 0.0, sa, 0.0, ca) * mat3(1.0, 0.0, 0.0, 0.0, cb, sb, 0.0, -sb, cb);
}
`;
const FALL_BEGIN = /* glsl */ `
vec3 transformed;
{
  float t = fract(uTime / aFall.y + aFall.x);
  float life = smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.78, 1.0, t)) * uFall;
  // Torn off: it barely moves at first, then the breeze has it.
  float along = t * (0.3 + 0.7 * t) * uFallDist;
  vec3 weave = vec3(sin(t * 9.0 + aFall.z * 30.0), cos(t * 7.0 + aFall.z * 17.0) * 0.45, sin(t * 5.0 + aFall.z * 11.0) * 0.6) * uDrift * t;
  transformed = fallTurn() * (position - vec3(0.0, 0.5, 0.0)) * aFall.w * life + aStart + uFallDir * along + weave;
}
`;
const PROJECT = /* glsl */ `
vec4 mvPosition = vec4(transformed, 1.0);
#ifdef USE_INSTANCING
  mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition.xyz += treeSway(mvPosition.xyz);
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;
`;
/** The leaves the breeze takes: their own patch (they are not on the tree, so no flutter, no lobe normal). */
export function applyFall(material, uniforms) {
    material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms);
        shader.vertexShader = shader.vertexShader
            .replace("#include <common>", `#include <common>\n${HEAD}${FALL_HEAD}`)
            .replace("#include <beginnormal_vertex>", "vec3 objectNormal = fallTurn() * normal;")
            .replace("#include <begin_vertex>", FALL_BEGIN)
            .replace("#include <project_vertex>", PROJECT);
    };
    material.customProgramCacheKey = () => "tree3d-fall";
}
/** Patches a built-in material (Lambert, Standard…). `leaves` adds the per-instance flutter, opening and normals. */
export function applyWind(material, uniforms, leaves) {
    material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms);
        let vs = shader.vertexShader.replace("#include <common>", `#include <common>\n${HEAD}${leaves ? LEAF_HEAD : ""}`).replace("#include <project_vertex>", PROJECT);
        if (leaves) {
            vs = vs
                .replace("#include <begin_vertex>", LEAF_BEGIN)
                .replace("#include <defaultnormal_vertex>", "#include <defaultnormal_vertex>\ntransformedNormal = normalize(mix(transformedNormal, normalMatrix * aOutward, uNormalBlend));");
            // Both faces of a leaf are lit by the crown's normal: undo the flip the back face gets.
            shader.fragmentShader = shader.fragmentShader.replace("#include <normal_fragment_begin>", "#include <normal_fragment_begin>\nnormal = normalize(vNormal);");
        }
        shader.vertexShader = vs;
    };
    material.customProgramCacheKey = () => (leaves ? "tree3d-leaves" : "tree3d-wood");
}
