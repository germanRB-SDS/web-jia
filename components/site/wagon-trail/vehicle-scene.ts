import { disposeUnclaimedModel } from "@/lib/motion/dispose-model";
/**
 * The wagon and its horse on the «Programa» road ([69-0]) — the Three.js half of <WagonTrail>.
 *
 * One transparent canvas over the whole layer, one orthographic camera where a world unit is a CSS pixel of the layer
 * (world X → right, world Z → down the page, +Y up) and heights lean up the page (`oblique`), a sun and a shadow
 * catcher as on the Jornadas road.
 * Everything is posed from one number: where the horse is on the road at time t, read from the same clock the prints
 * and the ruts use (WagonTrail.tsx `build`). The wagon's front axle trails it by the shafts' reach (a chord of the
 * road), its rear axle by the wheelbase, and it steers so that the front axle points at the horse. The horse's legs,
 * head, back and tail run their own gait, quickened by the road it covers.
 */
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ROUTE_CONFIG } from "../jornadas-route/config";
import { WAGON_SCALE, WAGON_TRAIL as T } from "./config";

type Pt = { x: number; y: number };

/** The road and its clock: samples, their arc length and the moment the horse is at each; see `build`. */
export type VehicleRoad = {
  line: Pt[];
  along: number[];
  time: number[];
  haltIndex: number;
  halt: number;
  horseEnd: number;
  length: number;
};

const UP = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const DEG = Math.PI / 180;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
const frac = (v: number) => v - Math.floor(v);
const LEGS = ["FL", "FR", "HL", "HR"] as const;
type Leg = (typeof LEGS)[number];
/** When in the cycle each foot leaves the ground: a four-beat walk, and a gallop where the hinds land together-ish. */
const OFFSETS: Record<"walk" | "gallop", Record<Leg, number>> = {
  walk: { HL: 0, FL: 0.25, HR: 0.5, FR: 0.75 },
  gallop: { HL: 0, HR: 0.1, FL: 0.4, FR: 0.52 },
};
/** Share of the cycle a foot spends on the ground. */
const STANCE = { walk: 0.62, gallop: 0.38 };

type Joint = { node: THREE.Object3D; rest: THREE.Quaternion };
type Wagon = { mover: THREE.Group; body: Joint; steer: Joint; front: Joint[]; rear: Joint[] };
type Horse = {
  mover: THREE.Group;
  motion: Joint & { y: number };
  neck: Joint;
  head: Joint;
  tail: Joint;
  legs: Record<Leg, { thigh: Joint; shin: Joint }>;
};

export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export class VehicleScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 4000);
  private sun: THREE.DirectionalLight;
  private shadowPlane: THREE.Mesh;
  private wagon: Wagon | null = null;
  private horse: Horse | null = null;
  private road: VehicleRoad | null = null;
  private raf: number | null = null;
  private startAt = 0;
  private lastS = 0;
  private lastT = 0;
  private phase = 0;
  private activity = 0;
  private disposed = false;
  private readonly qA = new THREE.Quaternion();
  private readonly qB = new THREE.Quaternion();

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera.up.set(0, 0, -1);

    this.scene.add(new THREE.HemisphereLight(0xfff6e6, 0xc9b79f, T.vehicle.light.sky));
    this.sun = new THREE.DirectionalLight(0xfff1dc, T.vehicle.light.sun);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.6;
    // The shadow camera follows the vehicle (see `pose`): a small, sharp map instead of one over the whole layer.
    Object.assign(this.sun.shadow.camera, { left: -150, right: 150, top: 150, bottom: -150, near: 1, far: 2000 });
    this.sun.shadow.camera.updateProjectionMatrix();
    this.scene.add(this.sun, this.sun.target);

    const shadowMat = new THREE.ShadowMaterial({ opacity: T.vehicle.shadowOpacity, transparent: true, depthWrite: false });
    this.shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.receiveShadow = true;
    this.scene.add(this.shadowPlane);
  }

  /** Loads both models; false when either cannot be used (the road then stays without them). */
  async load(urls: { wagon: string; horse: string }): Promise<boolean> {
    const loader = new GLTFLoader();
    const [wagon, horse] = await Promise.all([loader.loadAsync(urls.wagon), loader.loadAsync(urls.horse)]);
    if (this.disposed) {
      disposeUnclaimedModel(wagon.scene);
      disposeUnclaimedModel(horse.scene);
      return false;
    }
    this.wagon = this.adoptWagon(wagon);
    this.horse = this.adoptHorse(horse);
    return Boolean(this.wagon && this.horse);
  }

  /** The layer's size in CSS pixels: the canvas, the camera and the shadow catcher. */
  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
    Object.assign(this.camera, { left: -width / 2, right: width / 2, top: height / 2, bottom: -height / 2 });
    this.camera.position.set(width / 2, 1000, height / 2);
    this.camera.lookAt(width / 2, 0, height / 2);
    this.camera.updateProjectionMatrix();
    /* Oblique, not cenital: the ground stays exact to the pixel (the wheels on the ruts) and every height is drawn
       `oblique` times its size up the page, so the horse's legs and the wagon's side show. In view space the height
       above the ground is z + the camera's distance; it is added to y. */
    const k = T.vehicle.oblique;
    this.camera.projectionMatrix.multiply(new THREE.Matrix4().set(1, 0, 0, 0, 0, 1, k, 1000 * k, 0, 0, 1, 0, 0, 0, 0, 1));
    this.camera.projectionMatrixInverse.copy(this.camera.projectionMatrix).invert();
    this.shadowPlane.geometry.dispose();
    this.shadowPlane.geometry = new THREE.PlaneGeometry(width, height);
    this.shadowPlane.position.set(width / 2, 0, height / 2);
  }

  /** Drives the road from `startAt` (a performance.now() time, the moment the prints' clock started). */
  play(road: VehicleRoad, startAt: number): void {
    this.stop();
    if (!this.wagon || !this.horse) return;
    this.road = road;
    this.startAt = startAt;
    this.lastS = 0;
    this.lastT = 0;
    this.phase = 0;
    this.activity = 1;
    this.wagon.mover.visible = this.horse.mover.visible = true;
    const tick = (now: number) => {
      this.raf = null;
      if (this.disposed || !this.road) return;
      const t = (now - this.startAt) / 1000;
      if (t >= this.endTime()) {
        this.finish();
        return;
      }
      this.pose(Math.max(0, t));
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  stop(): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  dispose(): void {
    this.disposed = true;
    this.stop();
    for (const mover of [this.wagon?.mover, this.horse?.mover]) {
      if (!mover) continue;
      this.scene.remove(mover);
      disposeUnclaimedModel(mover);
    }
    this.wagon = this.horse = null;
    this.shadowPlane.geometry.dispose();
    (this.shadowPlane.material as THREE.Material).dispose();
    this.renderer.dispose();
  }

  // ---------------------------------------------------------------- the road

  /** Until the wagon's tail has left by the end of the road (which already lies past the layer's edge). */
  private endTime(): number {
    const road = this.road!;
    const tail = (T.vehicle.reach + T.vehicle.wheelbase + 1.6) * WAGON_SCALE;
    return road.horseEnd + tail / T.gallop.speed;
  }

  private finish(): void {
    this.stop();
    if (this.wagon) this.wagon.mover.visible = false;
    if (this.horse) this.horse.mover.visible = false;
    this.renderer.render(this.scene, this.camera);
  }

  /** Where the horse is (arc length, pixels) at time t: the inverse of the prints' clock; past the end it gallops on. */
  private horseAt(t: number): number {
    const { time, along, haltIndex, horseEnd, length } = this.road!;
    if (t >= horseEnd) return length + (t - horseEnd) * T.gallop.speed;
    let lo = 1;
    let hi = time.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (time[mid] <= t) lo = mid + 1;
      else hi = mid;
    }
    const i = lo;
    const move = time[i] - time[i - 1] - (i === haltIndex ? T.halt.pause : 0);
    const f = move > 0 ? clamp01((t - time[i - 1]) / move) : 1;
    return along[i - 1] + f * (along[i] - along[i - 1]);
  }

  /** A point of the road at arc length s; before the start and past the end it runs straight on. */
  private pointAt(s: number): Pt {
    const { line, along, length } = this.road!;
    const n = line.length;
    if (s <= 0 || s >= length) {
      const [a, b] = s <= 0 ? [line[0], line[1]] : [line[n - 2], line[n - 1]];
      const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const base = s <= 0 ? line[0] : line[n - 1];
      const k = s <= 0 ? s : s - length;
      return { x: base.x + ((b.x - a.x) / d) * k, y: base.y + ((b.y - a.y) / d) * k };
    }
    let lo = 1;
    let hi = n - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (along[mid] < s) lo = mid + 1;
      else hi = mid;
    }
    const f = (s - along[lo - 1]) / ((along[lo] - along[lo - 1]) || 1);
    return { x: line[lo - 1].x + (line[lo].x - line[lo - 1].x) * f, y: line[lo - 1].y + (line[lo].y - line[lo - 1].y) * f };
  }

  /** The point of the road behind `s` whose straight distance from `p` is `dist`: an axle on the end of a pole. */
  private behind(s: number, p: Pt, dist: number): { s: number; p: Pt } {
    let at = s - dist;
    let q = this.pointAt(at);
    for (let k = 0; k < 5; k++) {
      at -= dist - Math.hypot(p.x - q.x, p.y - q.y);
      q = this.pointAt(at);
    }
    return { s: at, p: q };
  }

  // ---------------------------------------------------------------- the pose

  private pose(t: number): void {
    const wagon = this.wagon!;
    const horse = this.horse!;
    const road = this.road!;
    const v = T.vehicle;
    const s = this.horseAt(t);
    const h = this.pointAt(s);
    const front = this.behind(s, h, v.reach * WAGON_SCALE);
    const rear = this.behind(front.s, front.p, v.wheelbase * WAGON_SCALE);

    // Headings: rotate the models' forward (−Z) onto a direction (x, z) about +Y.
    const heading = (from: Pt, to: Pt) => Math.atan2(-(to.x - from.x), -(to.y - from.y));
    const horseHeading = heading(front.p, h);
    const wagonHeading = heading(rear.p, front.p);
    horse.mover.position.set(h.x, 0, h.y);
    horse.mover.quaternion.setFromAxisAngle(UP, horseHeading);
    wagon.mover.position.set((front.p.x + rear.p.x) / 2, 0, (front.p.y + rear.p.y) / 2);
    wagon.mover.quaternion.setFromAxisAngle(UP, wagonHeading);
    let steer = horseHeading - wagonHeading;
    steer = Math.atan2(Math.sin(steer), Math.cos(steer));
    steer = THREE.MathUtils.clamp(steer, -v.maxSteerDeg * DEG, v.maxSteerDeg * DEG);
    turn(wagon.steer, UP, steer, this.qA);
    for (const w of wagon.front) turn(w, X, -front.s / WAGON_SCALE / v.radius.front, this.qA);
    for (const w of wagon.rear) turn(w, X, -rear.s / WAGON_SCALE / v.radius.rear, this.qA);
    turn(wagon.body, new THREE.Vector3(0, 0, 1), 0.8 * DEG * Math.sin(front.s / WAGON_SCALE / 4.5), this.qA);

    // The gait: walking before the halt, gathering into the gallop over the ramp after it.
    const dt = t - this.lastT;
    const ds = Math.max(0, s - this.lastS);
    this.lastT = t;
    this.lastS = s;
    const g = s < road.halt ? 0 : smooth(clamp01((s - road.halt) / T.halt.ramp));
    this.phase += ds / (v.walk.cycle + (v.gallop.cycle - v.walk.cycle) * g);
    if (dt > 0) {
      const target = clamp01(ds / dt / (T.walk.speed * 0.5));
      this.activity += (target - this.activity) * (1 - Math.exp(-6 * dt));
    }
    this.poseHorse(horse, g, this.activity, t);

    // The sun follows the vehicle, so its shadow map stays small and sharp.
    const cx = (h.x + rear.p.x) / 2;
    const cz = (h.y + rear.p.y) / 2;
    this.sun.target.position.set(cx, 0, cz);
    this.sun.position.set(cx - 220, 460, cz - 160);
  }

  private poseHorse(horse: Horse, g: number, a: number, t: number): void {
    const v = T.vehicle;
    const p = this.phase;
    const mix = (walk: number, gallop: number) => walk + (gallop - walk) * g;
    for (const leg of LEGS) {
      const w = stride(frac(p + OFFSETS.walk[leg]), STANCE.walk, v.walk.swing, v.walk.knee);
      const gl = stride(frac(p + OFFSETS.gallop[leg]), STANCE.gallop, v.gallop.swing, v.gallop.knee);
      const thigh = mix(w[0], gl[0]) * a;
      const knee = mix(w[1], gl[1]) * a;
      // Front knees fold back; the hind hocks bring the hoof forward under the belly.
      const hind = leg[0] === "H";
      turn(horse.legs[leg].thigh, X, (hind ? thigh * 0.85 : thigh) * DEG, this.qA);
      turn(horse.legs[leg].shin, X, (hind ? knee * 0.6 : -knee) * DEG, this.qA);
    }
    const c = 2 * Math.PI * p;
    const bob = mix(0.015 * Math.sin(2 * c), 0.07 * Math.sin(c)) * a;
    const pitch = mix(1.2 * Math.sin(2 * c), 6 * Math.sin(c + 0.6)) * a;
    // Standing still the head drops a little; walking it nods, galloping it reaches out and back.
    const nod = mix(4 * Math.sin(2 * c + 1), 10 * Math.sin(c + 2)) * a - 8 * (1 - a) - 6 * g * a;
    horse.motion.node.position.y = horse.motion.y + bob;
    turn(horse.motion, X, pitch * DEG, this.qA);
    turn(horse.neck, X, nod * DEG, this.qA);
    turn(horse.head, X, -nod * 0.4 * DEG, this.qA);
    // The tail swishes on its own clock and streams out behind at the gallop.
    horse.tail.node.quaternion
      .copy(horse.tail.rest)
      .multiply(this.qA.setFromAxisAngle(UP, (6 + 6 * (1 - a)) * DEG * Math.sin(t * 2.3)))
      .multiply(this.qB.setFromAxisAngle(X, -35 * g * a * DEG));
  }

  // ---------------------------------------------------------------- the models

  private adopt(gltf: GLTF): THREE.Group {
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = false;
      }
    });
    const mover = new THREE.Group();
    mover.add(gltf.scene);
    mover.scale.setScalar(WAGON_SCALE);
    mover.visible = false;
    this.scene.add(mover);
    return mover;
  }

  private adoptWagon(gltf: GLTF): Wagon | null {
    const n = ROUTE_CONFIG.wagon.nodes;
    const find = (name: string) => joint(gltf.scene.getObjectByName(name));
    const body = find(n.body);
    const steer = find(n.steer);
    const wheels = [n.wheels.FL, n.wheels.FR, n.wheels.RL, n.wheels.RR].map(find);
    if (!body || !steer || wheels.some((w) => !w)) {
      console.warn("[WagonTrail] wagon GLB node contract not met");
      disposeUnclaimedModel(gltf.scene);
      return null;
    }
    return { mover: this.adopt(gltf), body, steer, front: [wheels[0]!, wheels[1]!], rear: [wheels[2]!, wheels[3]!] };
  }

  private adoptHorse(gltf: GLTF): Horse | null {
    const find = (name: string) => joint(gltf.scene.getObjectByName(`JIA_Horse_${name}`));
    const motion = find("BodyMotion");
    const neck = find("Neck");
    const head = find("Head");
    const tail = find("Tail");
    const legs = Object.fromEntries(LEGS.map((l) => [l, { thigh: find(`Leg_${l}`), shin: find(`Shin_${l}`) }])) as Record<Leg, { thigh: Joint | null; shin: Joint | null }>;
    if (!motion || !neck || !head || !tail || LEGS.some((l) => !legs[l].thigh || !legs[l].shin)) {
      console.warn("[WagonTrail] horse GLB node contract not met");
      disposeUnclaimedModel(gltf.scene);
      return null;
    }
    return { mover: this.adopt(gltf), motion: { ...motion, y: motion.node.position.y }, neck, head, tail, legs: legs as Horse["legs"] };
  }
}

function joint(node: THREE.Object3D | undefined): Joint | null {
  return node ? { node, rest: node.quaternion.clone() } : null;
}

/** A joint turned `angle` radians about `axis` from its rest pose (never accumulated). */
function turn(j: Joint, axis: THREE.Vector3, angle: number, scratch: THREE.Quaternion): void {
  j.node.quaternion.copy(j.rest).multiply(scratch.setFromAxisAngle(axis, angle));
}

/** One leg's angles (degrees) at cycle position p: on the ground it sweeps from forward to back; in the air it
    swings forward again with the knee folded. Positive = forward. */
function stride(p: number, stance: number, swing: number, knee: number): [number, number] {
  if (p < stance) return [swing * (1 - (2 * p) / stance), 0];
  const u = (p - stance) / (1 - stance);
  return [swing * (-1 + 2 * smooth(u)), knee * Math.sin(Math.PI * u)];
}
