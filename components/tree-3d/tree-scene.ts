/**
 * The tree's Three.js scene, without React: it owns a transparent canvas inside the host element, fills the host's
 * box, frames the whole tree standing on the box's floor, and draws only while the host is on screen and the tab is
 * visible. The first time it is seen the tree rises from the ground and its leaves open; after that the wind
 * (wind.ts) is all that moves. With reduced motion there is no loop: one still frame of the grown tree.
 * Colours arrive as CSS (values or custom properties) and are resolved against the host, so they follow the page.
 */
import * as THREE from "three";
import { buildTree, type BuiltTree, type ResolvedPalette } from "./tree-builder";
import { applyWind, windUniforms, type WindUniforms } from "./wind";
import type { CssColor, TreeOptions, TreePalette } from "./config";

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2"));
  } catch {
    return false;
  }
}

/** Any CSS colour the page understands (custom properties included) → a Three.js colour, through a 1 px canvas. */
function colorResolver(host: HTMLElement) {
  const probe = document.createElement("span");
  probe.style.display = "none";
  host.appendChild(probe);
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  return {
    color(css: CssColor): THREE.Color {
      probe.style.color = "";
      probe.style.color = css;
      const computed = getComputedStyle(probe).color;
      if (!ctx) return new THREE.Color().setStyle(computed);
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = computed;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
    },
    done: () => probe.remove(),
  };
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export class TreeScene {
  private renderer: THREE.WebGLRenderer;
  private canvas: HTMLCanvasElement;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private tree = new THREE.Group();
  private built: BuiltTree;
  private bounds: THREE.Box3;
  private uniforms: WindUniforms = windUniforms();
  private disposables: { dispose(): void }[] = [];
  private io: IntersectionObserver;
  private onScreen = false;
  private frame = 0;
  private last = 0;
  private time = 0;
  private growStart = -1;
  private disposed = false;

  constructor(
    private host: HTMLElement,
    private options: TreeOptions,
    palette: TreePalette,
    seed: number,
    private reducedMotion: boolean,
  ) {
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute("aria-hidden", "true");
    this.canvas.style.cssText = "display:block;width:100%;height:100%";
    host.appendChild(this.canvas);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.camera = new THREE.PerspectiveCamera(options.camera.fovDeg, 1, 0.1, 200);

    const css = colorResolver(host);
    const resolved: ResolvedPalette = {
      leaves: palette.leaves.map((c) => css.color(c)),
      trunk: css.color(palette.trunk),
      trunkDark: css.color(palette.trunkDark),
      ground: css.color(palette.ground),
      groundDark: css.color(palette.groundDark),
    };
    const shadowColor = css.color(palette.shadow);
    const light = options.light;
    const sky = new THREE.HemisphereLight(css.color(light.sky), css.color(light.bounce), light.skyIntensity);
    const sun = new THREE.DirectionalLight(css.color(light.sun), light.sunIntensity);
    sun.position.set(...light.sunFrom);
    css.done();
    this.scene.add(sky, sun, sun.target);

    this.built = buildTree(options, resolved, seed);
    this.bounds = this.built.bounds.clone();
    this.assemble(shadowColor);

    const u = this.uniforms;
    u.uStrength.value = reducedMotion ? 0 : options.wind.strength;
    u.uSway.value = options.wind.sway;
    u.uFlutter.value = options.wind.flutter;
    u.uFlutterSpeed.value = options.wind.flutterSpeed;
    u.uHeight.value = this.built.height;
    u.uNormalBlend.value = options.leaves.normalBlend;
    u.uGrow.value = reducedMotion || !options.grow.enabled ? 1 : 0;
    this.applyGrow();

    this.io = new IntersectionObserver((entries) => {
      this.onScreen = entries.some((e) => e.isIntersecting);
      this.sync();
    });
    this.io.observe(host);
    document.addEventListener("visibilitychange", this.sync);
    this.resize();
  }

  private assemble(shadowColor: THREE.Color) {
    const b = this.built;
    const keep = <T extends { dispose(): void }>(x: T): T => {
      this.disposables.push(x);
      return x;
    };

    const woodMat = keep(new THREE.MeshLambertMaterial({ vertexColors: true }));
    applyWind(woodMat, this.uniforms, false);
    const wood = new THREE.Mesh(keep(b.wood), woodMat);
    wood.frustumCulled = false;

    const leafGeo = keep(b.leafShape);
    leafGeo.setAttribute("aOutward", new THREE.InstancedBufferAttribute(b.leaves.outward, 3));
    leafGeo.setAttribute("aLeaf", new THREE.InstancedBufferAttribute(b.leaves.leaf, 2));
    const leafMat = keep(new THREE.MeshLambertMaterial({ side: THREE.DoubleSide }));
    applyWind(leafMat, this.uniforms, true);
    const leaves = new THREE.InstancedMesh(leafGeo, leafMat, b.leaves.count);
    leaves.instanceMatrix = new THREE.InstancedBufferAttribute(b.leaves.matrices, 16);
    leaves.instanceColor = new THREE.InstancedBufferAttribute(b.leaves.colors, 3);
    leaves.frustumCulled = false;
    keep(leaves);

    this.tree.position.y = b.footY;
    this.tree.add(wood, leaves);

    const groundMat = keep(new THREE.MeshLambertMaterial({ vertexColors: true }));
    this.scene.add(this.tree, new THREE.Mesh(keep(b.mound), groundMat));
    if (b.pebbles) {
      const pebbleMat = keep(new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
      this.scene.add(new THREE.Mesh(keep(b.pebbles), pebbleMat));
    }

    // Contact shadow: a soft blot on the ground, drawn out away from the sun. No shadow map.
    const so = this.options.shadow;
    if (so.opacity > 0) {
      const size = 128;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");
      if (ctx) {
        const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        // An alpha map reads the green channel: opaque greys, white at the heart, black at the rim.
        g.addColorStop(0, "rgb(255,255,255)");
        g.addColorStop(0.45, "rgb(140,140,140)");
        g.addColorStop(1, "rgb(0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
        const tex = keep(new THREE.CanvasTexture(c));
        const mat = keep(new THREE.MeshBasicMaterial({ color: shadowColor, alphaMap: tex, transparent: true, opacity: so.opacity, depthWrite: false }));
        const blot = new THREE.Mesh(keep(new THREE.PlaneGeometry(2, 2)), mat);
        blot.rotation.x = -Math.PI / 2;
        const away = Math.sign(-this.options.light.sunFrom[0]) || 1;
        const rx = so.radius * so.stretch;
        blot.scale.set(rx, so.radius * 0.8, 1);
        blot.position.set(away * (rx - so.radius) * 0.6, 0.004, 0);
        blot.renderOrder = -1;
        this.scene.add(blot);
        this.bounds.expandByPoint(new THREE.Vector3(blot.position.x - rx, 0, 0)).expandByPoint(new THREE.Vector3(blot.position.x + rx, 0, 0));
      }
    }
  }

  /** The whole tree stands in the box, on its floor. */
  private frameCamera(aspect: number) {
    const o = this.options.camera;
    const cam = this.camera;
    const e = THREE.MathUtils.degToRad(o.elevationDeg);
    const centre = this.bounds.getCenter(new THREE.Vector3());
    const toEye = new THREE.Vector3(0, Math.sin(e), Math.cos(e));
    cam.aspect = aspect;
    cam.position.copy(centre).addScaledVector(toEye, 10);
    cam.lookAt(centre);
    cam.updateMatrixWorld();
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    let hx = 0;
    let yMin = Infinity;
    let yMax = -Infinity;
    let zMax = 0;
    const v = new THREE.Vector3();
    const { min, max } = this.bounds;
    for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) {
      v.set(x, y, z).sub(centre);
      hx = Math.max(hx, Math.abs(v.dot(right)));
      yMin = Math.min(yMin, v.dot(up));
      yMax = Math.max(yMax, v.dot(up));
      zMax = Math.max(zMax, v.dot(toEye));
    }
    const tan = Math.tan(THREE.MathUtils.degToRad(o.fovDeg) / 2);
    const boxH = (yMax - yMin) * (1 + o.padding);
    const boxW = 2 * hx * (1 + o.padding);
    const d = Math.max(boxH / (2 * tan), boxW / (2 * tan * aspect));
    // When the width decides, the spare height goes above the tree: it keeps its feet on the box's floor.
    const spare = 2 * d * tan - boxH;
    const target = centre.clone().addScaledVector(up, (yMax + yMin) / 2 + spare / 2);
    cam.position.copy(target).addScaledVector(toEye, d + zMax * 0.5);
    cam.lookAt(target);
    cam.updateProjectionMatrix();
  }

  resize() {
    if (this.disposed) return;
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.options.render.maxPixelRatio));
    this.renderer.setSize(w, h, false);
    this.frameCamera(w / h);
    this.render();
  }

  private applyGrow() {
    const g = this.uniforms.uGrow.value;
    this.tree.scale.setScalar(Math.max(0.0001, easeOutCubic(Math.min(1, g / 0.7))));
  }

  private render() {
    if (!this.disposed) this.renderer.render(this.scene, this.camera);
  }

  private sync = () => {
    const run = this.onScreen && !document.hidden && !this.disposed;
    if (this.reducedMotion) {
      if (run) this.render();
      return;
    }
    if (run && !this.frame) {
      this.last = 0;
      this.frame = requestAnimationFrame(this.tick);
    } else if (!run && this.frame) {
      cancelAnimationFrame(this.frame);
      this.frame = 0;
    }
  };

  private tick = (now: number) => {
    this.frame = requestAnimationFrame(this.tick);
    const { maxFps } = this.options.render;
    if (maxFps > 0 && this.last && now - this.last < 1000 / maxFps - 1) return;
    const dt = this.last ? Math.min(0.1, (now - this.last) / 1000) : 0;
    this.last = now;
    this.time += dt;
    this.uniforms.uTime.value = this.time;
    const grow = this.options.grow;
    if (grow.enabled && this.uniforms.uGrow.value < 1) {
      if (this.growStart < 0) this.growStart = now;
      this.uniforms.uGrow.value = Math.min(1, (now - this.growStart) / grow.ms);
      this.applyGrow();
    }
    this.render();
  };

  dispose() {
    this.disposed = true;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.io.disconnect();
    document.removeEventListener("visibilitychange", this.sync);
    for (const d of this.disposables) d.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.remove();
  }
}
