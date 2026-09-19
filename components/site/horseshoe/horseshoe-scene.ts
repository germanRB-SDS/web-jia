/**
 * The horseshoe's Three.js scene: one transparent canvas over the footer's upper block, an orthographic
 * camera in CSS pixels (1 unit = 1 px, y down = −y), the GLB from Blender hung on a nail. It only renders
 * when asked (placement, resize) — no loop while nothing moves. The hit button is placed over the shoe's
 * projected box after every render so the click and the accessible name live in real HTML.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HORSESHOE as CFG } from "./config";

export type Layout = "wide" | "narrow";

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
  private layout: Layout = "wide";
  private disposed = false;
  private readonly box = new THREE.Box3();

  constructor(
    private stage: HTMLElement,
    canvas: HTMLCanvasElement,
    private hit: HTMLElement,
    private anchor: HTMLElement | null,
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

  setLayout(layout: Layout) {
    this.layout = layout;
    this.place();
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

    const size = CFG.size[this.layout];
    const modelH = this.modelBox.max.y - this.modelBox.min.y;
    const targetH = Math.min(size.maxPx, Math.max(size.minPx, this.height * size.share));
    const scale = targetH / modelH;
    this.model.scale.setScalar(scale);
    // Model z runs through the shoe's thickness; keep it centred on the nail's plane.
    this.model.position.z = -(this.modelBox.max.z + this.modelBox.min.z) * scale * 0.5;

    const nail = CFG.nail[this.layout];
    const rightEdge = this.layout === "wide" && this.anchor ? this.anchor.getBoundingClientRect().right - rect.left : this.width;
    const nailX = rightEdge - nail.insetRightPx - this.modelBox.max.x * scale;
    const nailY = nail.topPx + this.modelBox.max.y * scale;
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
