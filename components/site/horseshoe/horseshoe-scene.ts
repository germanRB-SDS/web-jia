/**
 * The horseshoe's Three.js scene: one transparent canvas over the footer's upper block, an orthographic
 * camera in CSS pixels (1 unit = 1 px, y down = −y), the GLB from Blender hung on a nail. It only renders
 * when asked (placement, resize, each step of an animation) — no loop while nothing moves. The hit button
 * is placed over the shoe's projected box after every render so the click and the accessible name live in
 * real HTML. A click (`drop`) lets the nail give: the shoe wobbles, falls to the rule, bounces, lies there a
 * while and climbs back to its nail (GSAP timeline, config.fall); nothing moves under reduced motion.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { HORSESHOE as CFG } from "./config";

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Radius of the model's nail holes (metres), as authored in assets/3d/herradura/make-herradura.py. */
const HOLE_RADIUS_M = 0.0032;

export class HorseshoeScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);
  private pivot = new THREE.Group();
  private model: THREE.Object3D | null = null;
  private modelBox = new THREE.Box3();
  private nail = new THREE.Group();
  private frame = 0;
  private width = 1;
  private height = 1;
  private disposed = false;
  private readonly box = new THREE.Box3();
  private nailAt = new THREE.Vector2();
  private timeline: gsap.core.Timeline | null = null;

  constructor(
    private stage: HTMLElement,
    canvas: HTMLCanvasElement,
    private hit: HTMLElement,
    private reducedMotion: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera.position.set(0, 0, 1000);
    this.camera.lookAt(0, 0, 0);

    const sky = new THREE.HemisphereLight(0xfff6e6, 0x3a2a1c, CFG.render.light.sky);
    const sun = new THREE.DirectionalLight(0xfff1dc, CFG.render.light.sun);
    sun.position.set(-0.45, 0.8, 1).multiplyScalar(600);
    this.scene.add(sky, sun, this.pivot, this.nail);
  }

  async init(glbUrl: string): Promise<void> {
    const gltf = await new GLTFLoader().loadAsync(glbUrl);
    if (this.disposed) return;
    const model = gltf.scene;
    model.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) o.material.needsUpdate = true;
    });
    this.modelBox.setFromObject(model);
    this.model = model;
    this.pivot.add(model);
    this.buildNail();
    this.place();
  }

  /** The nail through the hanging hole: a dark shank along z and a head in front of the shoe. */
  private buildNail() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x4a3d31, metalness: 0.7, roughness: 0.45 });
    const shank = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 20), mat);
    shank.rotation.x = Math.PI / 2;
    shank.name = "shank";
    const head = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 24), mat);
    head.rotation.x = Math.PI / 2;
    head.name = "head";
    this.nail.add(shank, head);
  }

  resize() {
    this.place();
  }

  /** Scale to the block, hang from the nail, size the nail, render once. */
  private place() {
    const rect = this.stage.getBoundingClientRect();
    this.width = Math.max(1, rect.width);
    this.height = Math.max(1, rect.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CFG.render.maxPixelRatio));
    this.renderer.setSize(this.width, this.height, false);
    this.camera.right = this.width;
    this.camera.bottom = -this.height;
    this.camera.updateProjectionMatrix();
    if (!this.model) return;

    const size = CFG.size;
    const modelH = this.modelBox.max.y - this.modelBox.min.y;
    const targetH = Math.min(size.maxPx, Math.max(size.minPx, this.height * size.share));
    const scale = targetH / modelH;
    this.model.scale.setScalar(scale);
    // Model z runs through the shoe's thickness; keep it centred on the nail's plane.
    this.model.position.z = -(this.modelBox.max.z + this.modelBox.min.z) * scale * 0.5;

    const nailX = this.width - CFG.nail.insetRightPx - this.modelBox.max.x * scale;
    const nailY = CFG.nail.topPx + this.modelBox.max.y * scale;
    this.nailAt.set(nailX, -nailY);
    // A resize mid-fall puts the shoe back on its nail.
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    this.pivot.position.set(nailX, -nailY, 0);
    this.pivot.rotation.z = THREE.MathUtils.degToRad(CFG.restTiltDeg);

    const holeR = HOLE_RADIUS_M * scale;
    const thickness = (this.modelBox.max.z - this.modelBox.min.z) * scale;
    const shank = this.nail.getObjectByName("shank") as THREE.Mesh;
    const head = this.nail.getObjectByName("head") as THREE.Mesh;
    shank.scale.set(holeR * CFG.nail.shankShare, thickness * 3, holeR * CFG.nail.shankShare);
    shank.position.set(0, 0, thickness * 0.5);
    head.scale.set(holeR * CFG.nail.headShare, holeR * 0.9, holeR * CFG.nail.headShare);
    head.position.set(0, 0, thickness * 1.3);
    this.nail.position.copy(this.pivot.position);
    this.requestRender();
  }

  /** Whether the shoe is hanging still (a click only counts then). */
  get hung(): boolean {
    return Boolean(this.model) && !this.timeline;
  }

  /** The nail gives: wobble, drop to the rule, bounce, rest, climb back. */
  drop() {
    if (!this.model || this.timeline || this.reducedMotion) return;
    const F = CFG.fall;
    const rest = THREE.MathUtils.degToRad(CFG.restTiltDeg);
    const land = THREE.MathUtils.degToRad(F.landTiltDeg);
    // Where the hole ends up so the shoe, turned as it lands, lies on the floor (the stage's bottom edge).
    const rot = this.pivot.rotation.z;
    const pos = this.pivot.position.clone();
    this.pivot.rotation.z = land;
    this.pivot.position.set(this.nailAt.x, 0, 0);
    this.box.setFromObject(this.pivot);
    const floorY = -this.height - this.box.min.y;
    this.pivot.rotation.z = rot;
    this.pivot.position.copy(pos);

    const p = this.pivot.position;
    const r = this.pivot.rotation;
    const dropH = this.nailAt.y - floorY;
    const tl = gsap.timeline({
      onUpdate: () => this.requestRender(),
      onComplete: () => {
        this.timeline = null;
        this.requestRender();
      },
    });
    const s = F.swingMs / 1000;
    tl.to(r, { z: rest - THREE.MathUtils.degToRad(F.swingDeg), duration: s * 0.4, ease: "power2.out" })
      .to(r, { z: rest + THREE.MathUtils.degToRad(F.swingDeg * 0.6), duration: s * 0.35, ease: "power1.inOut" })
      .to(r, { z: rest, duration: s * 0.25, ease: "power1.in" })
      // The drop, turning as it goes; a little drift sideways.
      .to(p, { y: floorY, duration: F.fallMs / 1000, ease: "power2.in" }, "fall")
      .to(p, { x: this.nailAt.x - dropH * 0.06, duration: F.fallMs / 1000, ease: "none" }, "fall")
      .to(r, { z: rest + THREE.MathUtils.degToRad(F.spinDeg), duration: F.fallMs / 1000, ease: "power1.in" }, "fall");
    F.bounces.forEach((b, i) => {
      const up = b.ms / 2000;
      const last = i === F.bounces.length - 1;
      tl.to(p, { y: floorY + dropH * b.share, duration: up, ease: "power2.out" })
        .to(r, { z: last ? land : rest + THREE.MathUtils.degToRad(F.spinDeg + (F.landTiltDeg - F.spinDeg) * 0.6), duration: up * 2, ease: "power1.inOut" }, "<")
        .to(p, { y: floorY, duration: up, ease: "power2.in" });
    });
    tl.to({}, { duration: F.restMs / 1000 })
      .to(p, { x: this.nailAt.x, y: this.nailAt.y, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise")
      .to(r, { z: rest, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise");
    this.timeline = tl;
  }

  requestRender() {
    if (this.frame || this.disposed) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    this.placeHit();
  }

  /** The real button follows the shoe's projected box (CSS px of the stage). */
  private placeHit() {
    if (!this.model) return;
    this.box.setFromObject(this.pivot);
    const s = this.hit.style;
    s.left = `${this.box.min.x.toFixed(1)}px`;
    s.top = `${(-this.box.max.y).toFixed(1)}px`;
    s.width = `${(this.box.max.x - this.box.min.x).toFixed(1)}px`;
    s.height = `${(this.box.max.y - this.box.min.y).toFixed(1)}px`;
  }

  dispose() {
    this.disposed = true;
    this.timeline?.kill();
    this.timeline = null;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const m = o.material as THREE.Material | THREE.Material[];
        (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
      }
    });
    this.renderer.dispose();
  }
}
