/**
 * The window light of the classroom ([51-0]). One transparent canvas laid over the photograph, one orthographic
 * camera, one plane and one fragment shader: no volume, no particles, no post-processing. Everything the eye
 * reads as depth is the stacking — this canvas sits over the photograph and under the teacher cut out of it.
 *
 * The world is the photograph itself: x runs 0 → 1 across its width and y runs 0 → 1/ratio up its height, so a
 * unit is a frame width on both axes and an angle is a real angle at any screen size. The canvas is given the
 * rectangle the photograph is actually DRAWN in (see Experiences.module.css), never the section's box.
 *
 * The cycle runs whenever the band comes back on screen (promoter, 25-09-2026): scroll away, come back, and the
 * sun comes in again. Between one visit and the next nothing is drawn and no frame is asked for — the renderer
 * stays built because rebuilding it would cost far more than holding one plane and one shader. Under reduced
 * motion it paints a single still frame instead. Colour comes from a palette token; there is not one literal
 * colour in this file.
 */
import * as THREE from "three";
import { SUN_RAYS as CFG } from "./config";

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

const VERTEX = /* glsl */ `
  varying vec2 vPos;
  void main() {
    vPos = (modelMatrix * vec4(position, 1.0)).xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision mediump float;
  varying vec2 vPos;

  uniform vec2 uOrigin;      // the middle of the glass
  uniform vec2 uDir;         // where the light goes, unit length
  uniform vec2 uGlowHalf;    // half size of the pool of light around the glass
  uniform float uW0;         // half width of the sheet of light as it leaves the glass
  uniform float uTanSpread;  // how fast the fan opens
  uniform float uReach;      // how far it carries
  uniform float uFadeFrom;   // where along that reach it starts dying
  uniform vec4 uBands;       // x,y = frequencies · z,w = phases
  uniform float uMix;        // how the two frequencies share the shafts
  uniform float uStrength;
  uniform float uSoftness;   // how far down the band's range a shaft starts: the blur of the light
  uniform float uFill;       // how lit the air between the shafts is
  uniform float uGlow;
  uniform float uWipe;       // the cloud's edge, across the fan
  uniform float uFeather;    // how soft that edge is
  uniform float uIntensity;  // the whole thing, 0..1
  uniform vec3 uColor;

  const float PI = 3.141592653589793;

  void main() {
    vec2 rel = vPos - uOrigin;
    vec2 perp = vec2(-uDir.y, uDir.x);
    float s = dot(rel, uDir);   // along the light
    float q = dot(rel, perp);   // across it

    // Nothing behind the glass, and a soft lip right at it: the shafts are born there, not cut out there.
    float front = smoothstep(-0.004, 0.03, s);
    float t = clamp(s / uReach, 0.0, 1.0);

    // The fan opens with distance. n is the lateral place inside it, -1 at one lip, +1 at the other.
    float halfW = uW0 + max(s, 0.0) * uTanSpread;
    float n = q / max(halfW, 1e-4);

    // The shafts the glazing bars cut. Two frequencies, because one alone is a comb and a comb is a pattern.
    float band = uMix * cos(n * uBands.x * PI + uBands.z) + (1.0 - uMix) * cos(n * uBands.y * PI + uBands.w);
    float shafts = smoothstep(uSoftness, 1.0, band);

    // The fan has no edge: it dies long before it would have one.
    float cone = 1.0 - smoothstep(0.32, 1.0, abs(n));

    // And the air eats the light well before the end of its reach.
    float along = front * (1.0 - smoothstep(uFadeFrom, 1.0, t));

    // The cloud's edge sweeping across the fan, with a little wobble so it is a cloud and not a ruler.
    float edge = n + 0.1 * sin(s * 9.0 + 1.3);
    float cloud = smoothstep(uWipe, uWipe + uFeather, edge);

    // The whole wedge of air is lit; the shafts are the bright places inside it, not stripes on nothing.
    float lit = mix(uFill, 1.0, shafts);
    float rays = lit * cone * along * cloud * uStrength;

    // The source. It lights as soon as the cloud starts to go, not when the sweep reaches the middle.
    float gate = smoothstep(uWipe, uWipe + uFeather, 0.85);
    vec2 g = rel / uGlowHalf;
    float glow = exp(-dot(g, g) * 1.6) * uGlow * gate;

    float a = clamp((rays + glow) * uIntensity, 0.0, 1.0);
    gl_FragColor = vec4(uColor * a, a);   // premultiplied: the canvas is composited with screen over the photo
  }
`;

/** Eased at both ends: nothing in this light starts or stops abruptly (promoter, 25-09-2026). */
const easeInOut = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Where the wipe starts and ends: past both lips of the fan, plus the wobble and the feather. */
const WIPE_FROM = 1.15;
const WIPE_TO = -1.15 - CFG.timing.wipeFeather;

export class SunRaysScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera;
  private geometry: THREE.PlaneGeometry;
  private material: THREE.ShaderMaterial;
  private frame = 0;
  /** Milliseconds of the cycle already played. Kept by hand so a hidden tab does not eat the light. */
  private played = 0;
  private last = 0;
  private running = false;
  private disposed = false;
  private readonly worldHeight: number;
  private readonly fullReach: number;

  constructor(
    private stage: HTMLElement,
    canvas: HTMLCanvasElement,
    private reducedMotion: boolean,
    /** The light's colour, as the palette gives it (a CSS colour string). */
    color: string,
  ) {
    const { width, height } = CFG.frame;
    const ratio = width / height;
    this.worldHeight = 1 / ratio;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    // A flat 2D painting: no transfer function on the way out, so the token's value is the value that lands.
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

    this.camera = new THREE.OrthographicCamera(0, 1, this.worldHeight, 0, -1, 1);

    // The glass, from pixels of the original to world units.
    const g = CFG.glass;
    const origin = new THREE.Vector2((g.left + g.right) / 2 / width, (1 - (g.top + g.bottom) / 2 / height) / ratio);
    const glassHalf = new THREE.Vector2((g.right - g.left) / 2 / width, (g.bottom - g.top) / 2 / height / ratio);

    // Down and to the left; the perpendicular is what the shader measures across the fan.
    const tilt = (CFG.fan.tiltDeg * Math.PI) / 180;
    const dir = new THREE.Vector2(-Math.sin(tilt), -Math.cos(tilt));
    const perp = new THREE.Vector2(-dir.y, dir.x);
    // The sheet is as wide as the glass looks from the light's point of view: its box projected across the beam.
    const w0 = Math.abs(glassHalf.x * perp.x) + Math.abs(glassHalf.y * perp.y);

    this.fullReach = CFG.fan.reach;
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uOrigin: { value: origin },
        uDir: { value: dir },
        uGlowHalf: { value: new THREE.Vector2(glassHalf.x * CFG.fan.glowScale.x, glassHalf.y * CFG.fan.glowScale.y) },
        uW0: { value: w0 },
        uTanSpread: { value: Math.tan((CFG.fan.spreadDeg * Math.PI) / 180) },
        uReach: { value: this.fullReach },
        uFadeFrom: { value: CFG.fan.fadeFrom },
        uBands: { value: new THREE.Vector4(CFG.fan.bands.a, CFG.fan.bands.b, CFG.fan.bands.phaseA, CFG.fan.bands.phaseB) },
        uMix: { value: CFG.fan.bands.mix },
        uStrength: { value: CFG.fan.strength },
        uSoftness: { value: CFG.fan.softness },
        uFill: { value: CFG.fan.fill },
        uGlow: { value: CFG.fan.glow },
        uWipe: { value: WIPE_FROM },
        uFeather: { value: CFG.timing.wipeFeather },
        uIntensity: { value: 0 },
        uColor: { value: new THREE.Color().setStyle(color, THREE.LinearSRGBColorSpace) },
      },
    });

    this.geometry = new THREE.PlaneGeometry(1, this.worldHeight);
    const mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.set(0.5, this.worldHeight / 2, 0);
    mesh.frustumCulled = false;
    this.scene.add(mesh);

    this.resize();
  }

  resize(): void {
    if (this.disposed) return;
    const w = Math.max(1, this.stage.clientWidth);
    const h = Math.max(1, this.stage.clientHeight);
    const cap = Math.min(CFG.render.maxPixelRatio, CFG.render.maxCanvasWidth / w);
    this.renderer.setPixelRatio(Math.max(0.5, Math.min(window.devicePixelRatio || 1, cap)));
    this.renderer.setSize(w, h, false);
    if (this.reducedMotion) this.still();
    else if (!this.running) this.renderer.render(this.scene, this.camera);
  }

  /**
   * The light comes in, from the top. Called every time the band comes back on screen, and it always starts
   * the cycle over: coming back to a room half lit would look like a glitch, not like a sun.
   */
  start(): void {
    if (this.disposed) return;
    if (this.reducedMotion) {
      this.still();
      return;
    }
    this.played = 0;
    this.last = performance.now();
    this.running = true;
    if (!this.frame) this.frame = requestAnimationFrame(this.tick);
  }

  /** A hidden tab stops the clock instead of spending the light where nobody is looking. */
  setVisible(visible: boolean): void {
    if (this.disposed || this.reducedMotion || !this.running) return;
    if (visible) {
      this.last = performance.now();
      if (!this.frame) this.frame = requestAnimationFrame(this.tick);
    } else if (this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  }

  /** One frame, held: the composition in depth stays, the movement goes. */
  private still(): void {
    const u = this.material.uniforms;
    u.uWipe.value = WIPE_TO;
    u.uReach.value = this.fullReach;
    u.uIntensity.value = CFG.stillStrength;
    this.renderer.render(this.scene, this.camera);
  }

  private tick = (now: number) => {
    this.frame = 0;
    if (this.disposed) return;
    this.played += now - this.last;
    this.last = now;

    const T = CFG.timing;
    const t = this.played / 1000;
    const u = this.material.uniforms;

    // The cloud retreats, and the light is already climbing behind it.
    const sweep = easeInOut(clamp01(t / T.wipe));
    u.uWipe.value = WIPE_FROM + sweep * (WIPE_TO - WIPE_FROM);
    u.uReach.value = this.fullReach * (0.92 + 0.08 * easeInOut(clamp01(t / T.holdUntil)));

    let intensity = easeInOut(clamp01(t / T.rise));
    if (t > T.holdUntil) intensity *= 1 - easeInOut(clamp01((t - T.holdUntil) / (T.total - T.holdUntil)));
    u.uIntensity.value = intensity;

    this.renderer.render(this.scene, this.camera);

    if (t >= T.total) {
      // Spent. Clear the glass and stop asking for frames until the band comes back on screen.
      u.uIntensity.value = 0;
      this.renderer.render(this.scene, this.camera);
      this.running = false;
      return;
    }
    this.frame = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
