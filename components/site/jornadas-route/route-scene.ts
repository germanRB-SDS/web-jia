/**
 * Jornadas road — the Three.js scene and the GSAP timeline behind <JornadasRoute>.
 *
 * One renderer, one fixed top-down orthographic camera, one render loop that only runs
 * while something moves. The single source of truth for movement is `anim.distance`
 * (map units along the road); every pose (position, heading, steer, wheels, sway) derives
 * from it. HTML labels are positioned by the React side from the projected disc positions
 * this class reports.
 */
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ROUTE_CONFIG, ROUTE_LAYOUTS, type LayoutName, type RouteLayout } from "./config";

export type PlayState = "loading" | "idle" | "playing" | "paused" | "done" | "static";
export type LabelLayout = { positions: { x: number; y: number }[]; unitPx: number };

export type SceneHandlers = {
  onState: (state: PlayState) => void;
  onStop: (index: number) => void;
  onReset: () => void;
  onLabels: (layout: LabelLayout) => void;
  /** Called once when WebGL or the model cannot be used; the component shows its static alternative. */
  onFail: (reason: "webgl" | "glb") => void;
};

type Colors = { road: string; disc: string; discActive: string };

const UP = new THREE.Vector3(0, 1, 0);
const X = new THREE.Vector3(1, 0, 0);
const Z = new THREE.Vector3(0, 0, 1);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Velocity trapezoid: ramp up over `a` of the tween, cruise, ramp down over `b` (C1 continuous). */
function trapezoidEase(a: number, b: number): (t: number) => number {
  a = Math.min(a, 0.5);
  b = Math.min(b, 0.5);
  const total = 1 - (a + b) / 2;
  return (t: number) => {
    let s: number;
    if (t < a) s = (t * t) / (2 * a);
    else if (t < 1 - b) s = a / 2 + (t - a);
    else {
      const r = 1 - t;
      s = total - (r * r) / (2 * b);
    }
    return s / total;
  };
}

type Wagon = {
  mover: THREE.Group;
  body: THREE.Object3D;
  steer: THREE.Object3D;
  wheels: { node: THREE.Object3D; radius: number; rest: THREE.Quaternion }[];
  bodyRest: { q: THREE.Quaternion; y: number };
  steerRest: THREE.Quaternion;
  materials: THREE.Material[];
};

type Road = {
  curve: THREE.CatmullRomCurve3;
  length: number;
  ribbon: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  caps: THREE.Mesh[];
  discs: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>[];
  stopDistances: number[];
  bumps: { distance: number; strength: number }[];
  layout: RouteLayout;
};

export class RouteScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 200);
  private shadowPlane: THREE.Mesh;
  private sun: THREE.DirectionalLight;
  private road: Road | null = null;
  private wagon: Wagon | null = null;
  private tl: gsap.core.Timeline | null = null;
  private segments: { start: number; duration: number; from: number; to: number }[] = [];
  private introDuration = 0;
  private anim = { reveal: 0, wagonAlpha: 0, distance: 0 };
  private visited: boolean[];
  private state: PlayState = "loading";
  private raf: number | null = null;
  private lastTime = 0;
  private lastDistance = 0;
  private speedSmoothed = 0;
  private accelSmoothed = 0;
  private visible = false;
  private autoPaused = false;
  private userPaused = false;
  private ready = false;
  private disposed = false;
  private width = 1;
  private height = 1;
  private colors: { road: THREE.Color; disc: THREE.Color; discActive: THREE.Color };
  // Scratch objects reused every frame.
  private readonly vP = new THREE.Vector3();
  private readonly vT = new THREE.Vector3();
  private readonly vT2 = new THREE.Vector3();
  private readonly qA = new THREE.Quaternion();
  private readonly qB = new THREE.Quaternion();

  constructor(
    private container: HTMLElement,
    canvas: HTMLCanvasElement,
    private layoutName: LayoutName,
    private reducedMotion: boolean,
    private stopCount: number,
    colors: Colors,
    private handlers: SceneHandlers,
  ) {
    this.visited = Array.from({ length: stopCount }, () => false);
    this.colors = { road: new THREE.Color(colors.road), disc: new THREE.Color(colors.disc), discActive: new THREE.Color(colors.discActive) };
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Camera: straight down. `up` is −Z so that design-y (down on screen) maps to world +Z.
    this.camera.up.set(0, 0, -1);

    const sky = new THREE.HemisphereLight(0xfff6e6, 0xc9b79f, ROUTE_CONFIG.render.light.sky);
    this.scene.add(sky);
    this.sun = new THREE.DirectionalLight(0xfff1dc, ROUTE_CONFIG.render.light.sun);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun, this.sun.target);

    // Shadow catcher: invisible except where the wagon's shadow falls (also darkens the road below it).
    const shadowMat = new THREE.ShadowMaterial({ opacity: ROUTE_CONFIG.road.shadowOpacity, transparent: true, depthWrite: false });
    this.shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
    this.shadowPlane.rotation.x = -Math.PI / 2;
    this.shadowPlane.receiveShadow = true;
    this.shadowPlane.renderOrder = 10;
    this.scene.add(this.shadowPlane);
  }

  /** Builds the road, loads the model and prepares the timeline. Resolves when the scene can play. */
  async init(glbUrl: string | null): Promise<void> {
    this.buildRoad(ROUTE_LAYOUTS[this.layoutName]);
    this.resize();
    if (glbUrl) {
      try {
        const gltf = await new GLTFLoader().loadAsync(glbUrl);
        if (this.disposed) return;
        this.wagon = this.adoptWagon(gltf);
      } catch (err) {
        console.warn("[JornadasRoute] GLB unavailable, static road shown:", err);
      }
    }
    if (!this.wagon) {
      this.showStatic(false);
      this.handlers.onFail("glb");
      return;
    }
    if (this.reducedMotion) {
      this.showStatic(true);
      return;
    }
    this.buildTimeline();
    this.ready = true;
    this.setState("idle");
    this.renderOnce();
    this.maybeStart();
  }

  // ---------------------------------------------------------------- road

  private buildRoad(layout: RouteLayout): void {
    this.disposeRoad();
    const pts = layout.points.map(([x, y]) => new THREE.Vector3(x, 0, y));
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
    curve.arcLengthDivisions = 800;
    curve.updateArcLengths();
    const length = curve.getLength();
    const lengths = curve.getLengths(curve.arcLengthDivisions);
    // Arc-length position (0..1) of a control point: CatmullRom parametrises points uniformly in t.
    const tOfPoint = (i: number) => i / (pts.length - 1);
    const uOfT = (t: number) => {
      const s = t * curve.arcLengthDivisions;
      const k = Math.min(curve.arcLengthDivisions - 1, Math.floor(s));
      const f = s - k;
      return (lengths[k] + (lengths[k + 1] - lengths[k]) * f) / length;
    };
    const stopDistances = this.stopDistancesFor(layout, curve, length, uOfT, tOfPoint);
    const bumps = layout.bumpPoints.map((b) => ({ distance: uOfT(tOfPoint(b.point)) * length, strength: b.strength }));

    // Flat ribbon: vertices along the road; the reveal only advances the draw range.
    const N = ROUTE_CONFIG.road.ribbonSegments;
    const half = ROUTE_CONFIG.road.width / 2;
    const y = ROUTE_CONFIG.road.y.road;
    const positions = new Float32Array((N + 1) * 2 * 3);
    const p = new THREE.Vector3();
    const t = new THREE.Vector3();
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      curve.getPointAt(u, p);
      curve.getTangentAt(u, t);
      const nx = t.z;
      const nz = -t.x; // in-plane normal
      positions.set([p.x + nx * half, y, p.z + nz * half, p.x - nx * half, y, p.z - nz * half], i * 6);
    }
    const index: number[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setIndex(index);
    const roadMat = new THREE.MeshBasicMaterial({ color: this.colors.road, side: THREE.DoubleSide });
    const ribbon = new THREE.Mesh(geo, roadMat);
    ribbon.renderOrder = 1;
    this.scene.add(ribbon);

    const capGeo = new THREE.CircleGeometry(half, 24).rotateX(-Math.PI / 2);
    const caps = [0, 1].map((u) => {
      const m = new THREE.Mesh(capGeo, roadMat);
      curve.getPointAt(u, p);
      m.position.set(p.x, y, p.z);
      m.renderOrder = 1;
      m.visible = false;
      this.scene.add(m);
      return m;
    });

    const discGeo = new THREE.CircleGeometry(ROUTE_CONFIG.road.discRadius, 40).rotateX(-Math.PI / 2);
    const discs = stopDistances.map((d) => {
      const mat = new THREE.MeshBasicMaterial({ color: this.colors.disc, transparent: true, opacity: 0 });
      const m = new THREE.Mesh(discGeo, mat);
      curve.getPointAt(d / length, p);
      m.position.set(p.x, ROUTE_CONFIG.road.y.disc, p.z);
      m.renderOrder = 2;
      this.scene.add(m);
      return m;
    });

    const { w, h } = layout.box;
    this.shadowPlane.geometry.dispose();
    this.shadowPlane.geometry = new THREE.PlaneGeometry(w * 2, h * 2);
    this.shadowPlane.position.set(w / 2, ROUTE_CONFIG.road.y.shadow, h / 2);
    this.sun.position.set(w / 2 - 22, 46, h / 2 - 16);
    this.sun.target.position.set(w / 2, 0, h / 2);
    const r = Math.max(w, h) / 2 + 12;
    Object.assign(this.sun.shadow.camera, { left: -r, right: r, top: r, bottom: -r, near: 1, far: 120 });
    this.sun.shadow.camera.updateProjectionMatrix();

    this.road = { curve, length, ribbon, caps, discs, stopDistances, bumps, layout };
    this.applyReveal();
  }

  /**
   * Arc-length positions of the stops: one slot per workshop, taken evenly from the layout's
   * slot list (travel order, distinct screen y). Each slot is located on its run by searching
   * the point of the curve closest to the requested y within that run's parameter range.
   * With more workshops than slots the stops fall back to even spacing along the whole road.
   */
  private stopDistancesFor(
    layout: RouteLayout,
    curve: THREE.CatmullRomCurve3,
    length: number,
    uOfT: (t: number) => number,
    tOfPoint: (i: number) => number,
  ): number[] {
    const n = this.stopCount;
    const slots = layout.slots;
    if (n > slots.length) {
      console.warn(`[JornadasRoute] ${n} paradas pero solo ${slots.length} slots en la disposición: reparto uniforme.`);
      return Array.from({ length: n }, (_, i) => ((i + 1) / (n + 1)) * length);
    }
    const chosen = slots
      .map((slot, index) => ({ slot, index }))
      .sort((a, b) => a.slot.priority - b.slot.priority)
      .slice(0, n)
      .sort((a, b) => a.index - b.index)
      .map((s) => s.slot);
    const p = new THREE.Vector3();
    return chosen.map((slot) => {
      const u0 = uOfT(tOfPoint(slot.run[0]));
      const u1 = uOfT(tOfPoint(slot.run[1]));
      let best = u0;
      let bestErr = Infinity;
      const steps = 200;
      for (let k = 0; k <= steps; k++) {
        const u = u0 + ((u1 - u0) * k) / steps;
        curve.getPointAt(u, p);
        const err = Math.abs(p.z - slot.y);
        if (err < bestErr) {
          bestErr = err;
          best = u;
        }
      }
      return best * length;
    });
  }

  private disposeRoad(): void {
    if (!this.road) return;
    const { ribbon, caps, discs } = this.road;
    this.scene.remove(ribbon, ...caps, ...discs);
    ribbon.geometry.dispose();
    ribbon.material.dispose();
    caps[0].geometry.dispose();
    discs[0]?.geometry.dispose();
    discs.forEach((d) => d.material.dispose());
    this.road = null;
  }

  private applyReveal(): void {
    if (!this.road) return;
    const N = ROUTE_CONFIG.road.ribbonSegments;
    const shown = Math.round(clamp01(this.anim.reveal) * N);
    this.road.ribbon.geometry.setDrawRange(0, shown * 6);
    this.road.caps[0].visible = shown > 0;
    this.road.caps[1].visible = shown >= N;
  }

  // ---------------------------------------------------------------- wagon

  private adoptWagon(gltf: GLTF): Wagon | null {
    const { nodes, model } = ROUTE_CONFIG.wagon;
    const scale = ROUTE_LAYOUTS[this.layoutName].wagonScale;
    const find = (name: string) => gltf.scene.getObjectByName(name) ?? null;
    const root = find(nodes.root);
    const body = find(nodes.body);
    const steer = find(nodes.steer);
    const wheelNodes = [
      { node: find(nodes.wheels.FL), radius: model.frontRadius },
      { node: find(nodes.wheels.FR), radius: model.frontRadius },
      { node: find(nodes.wheels.RL), radius: model.rearRadius },
      { node: find(nodes.wheels.RR), radius: model.rearRadius },
    ];
    if (!root || !body || !steer || wheelNodes.some((w) => !w.node)) {
      console.warn("[JornadasRoute] GLB node contract not met:", gltf.scene.children.map((c) => c.name));
      return null;
    }
    const materials = new Set<THREE.Material>();
    gltf.scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const mesh = o as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) => materials.add(m));
      }
    });
    const mover = new THREE.Group();
    mover.name = "JIA_RouteMover";
    mover.add(gltf.scene);
    mover.scale.setScalar(scale);
    mover.visible = false;
    this.scene.add(mover);
    return {
      mover,
      body,
      steer,
      wheels: wheelNodes.map((w) => ({ node: w.node!, radius: w.radius, rest: w.node!.quaternion.clone() })),
      bodyRest: { q: body.quaternion.clone(), y: body.position.y },
      steerRest: steer.quaternion.clone(),
      materials: [...materials],
    };
  }

  private applyWagonAlpha(): void {
    if (!this.wagon) return;
    const a = clamp01(this.anim.wagonAlpha);
    this.wagon.mover.visible = a > 0;
    for (const m of this.wagon.materials) {
      m.transparent = a < 1;
      m.opacity = a;
      m.depthWrite = a >= 1;
      m.needsUpdate = false;
    }
  }

  /** Pose everything from `anim.distance`; `dt` (s) feeds the speed/acceleration estimate for the sway. */
  private pose(dt: number): void {
    const road = this.road;
    const wagon = this.wagon;
    if (!road || !wagon) return;
    const { curve, length } = road;
    const cfg = ROUTE_CONFIG;
    const d = Math.min(Math.max(this.anim.distance, 0), length);
    const u = d / length;
    curve.getPointAt(u, this.vP);
    curve.getTangentAt(u, this.vT);
    wagon.mover.position.set(this.vP.x, cfg.road.y.wagon, this.vP.z);
    // Heading: rotate the model's forward (−Z) onto the tangent about +Y; a quaternion never wraps.
    const heading = Math.atan2(-this.vT.x, -this.vT.z);
    wagon.mover.quaternion.setFromAxisAngle(UP, heading);

    // Steering from local curvature (signed turn angle over a short look-ahead).
    const du = cfg.wagon.curvatureStep / length;
    curve.getTangentAt(Math.min(1, u + du), this.vT2);
    const turn = Math.atan2(this.vT2.x * this.vT.z - this.vT2.z * this.vT.x, this.vT.dot(this.vT2));
    const curvature = turn / cfg.wagon.curvatureStep;
    const scale = road.layout.wagonScale;
    const wheelbase = cfg.wagon.model.wheelbase * scale;
    const maxSteer = THREE.MathUtils.degToRad(cfg.wagon.maxSteerDeg);
    const steer = THREE.MathUtils.clamp(Math.atan(wheelbase * curvature), -maxSteer, maxSteer);
    wagon.steer.quaternion.copy(wagon.steerRest).multiply(this.qA.setFromAxisAngle(UP, steer));

    // Wheels: angle = −distance / radius in model units, relative to the rest pose (no accumulation).
    const dModel = d / scale;
    for (const w of wagon.wheels) {
      w.node.quaternion.copy(w.rest).multiply(this.qA.setFromAxisAngle(X, -dModel / w.radius));
    }

    // Speed / acceleration estimate (smoothed) → sway amplitude and braking pitch.
    if (dt > 0) {
      const speed = (d - this.lastDistance) / dt;
      const k = 1 - Math.exp(-cfg.motion.smoothing * dt);
      const prev = this.speedSmoothed;
      this.speedSmoothed += (speed - this.speedSmoothed) * k;
      this.accelSmoothed += ((this.speedSmoothed - prev) / dt - this.accelSmoothed) * k;
    }
    this.lastDistance = d;
    const v = clamp01(Math.abs(this.speedSmoothed) / cfg.timing.speed);
    const accelN = THREE.MathUtils.clamp(this.accelSmoothed / (cfg.timing.speed / cfg.timing.accel), -1, 1);

    // Body: lateral roll with distance, brief pitch with acceleration, damped response after bumps.
    let roll = THREE.MathUtils.degToRad(cfg.motion.rollDeg) * Math.sin(d / cfg.motion.rollWavelength) * v;
    let pitch = THREE.MathUtils.degToRad(cfg.motion.pitchAccelDeg) * accelN;
    let lift = 0;
    for (const b of road.bumps) {
      const x = d - b.distance;
      if (x <= 0 || x > cfg.motion.bumpDecay * 4) continue;
      const r = b.strength * Math.exp(-x / cfg.motion.bumpDecay) * Math.sin((2 * Math.PI * x) / cfg.motion.bumpWavelength);
      pitch += THREE.MathUtils.degToRad(cfg.motion.bumpPitchDeg) * r;
      roll += THREE.MathUtils.degToRad(cfg.motion.bumpPitchDeg) * 0.35 * r;
      lift += cfg.motion.bumpLift * Math.max(0, r);
    }
    wagon.body.quaternion
      .copy(wagon.bodyRest.q)
      .multiply(this.qA.setFromAxisAngle(Z, roll))
      .multiply(this.qB.setFromAxisAngle(X, pitch));
    wagon.body.position.y = wagon.bodyRest.y + lift;
  }

  // ---------------------------------------------------------------- timeline

  private buildTimeline(): void {
    const road = this.road!;
    const { timing } = ROUTE_CONFIG;
    this.tl?.kill();
    const tl = gsap.timeline({ paused: true, onComplete: () => this.finish() });
    tl.to(this.anim, { reveal: 1, duration: timing.reveal, ease: "power1.inOut" });
    tl.to(
      road.discs.map((d) => d.material),
      { opacity: 1, duration: timing.discIn, stagger: timing.discStagger, ease: "power1.out" },
      "-=0.25",
    );
    tl.to(this.anim, { wagonAlpha: 1, duration: timing.wagonIn, ease: "power1.out" }, ">-0.05");
    this.introDuration = tl.duration();
    this.segments = [];
    let from = 0;
    road.stopDistances.forEach((to, i) => {
      const len = to - from;
      const duration = len / timing.speed + (timing.accel + timing.decel) / 2;
      const start = tl.duration();
      tl.to(this.anim, { distance: to, duration, ease: trapezoidEase(timing.accel / duration, timing.decel / duration) });
      tl.call(() => this.arrive(i));
      if (i < road.stopDistances.length - 1) tl.to({}, { duration: timing.dwell });
      this.segments.push({ start, duration, from, to });
      from = to;
    });
    this.tl = tl;
  }

  private arrive(i: number): void {
    if (this.visited[i] || !this.road) return;
    this.visited[i] = true;
    this.anim.distance = this.road.stopDistances[i];
    this.activateDisc(i, true);
    this.handlers.onStop(i);
  }

  private activateDisc(i: number, animate: boolean): void {
    const disc = this.road?.discs[i];
    if (!disc) return;
    disc.material.color.copy(this.colors.discActive);
    disc.material.opacity = 1;
    if (animate) gsap.fromTo(disc.scale, { x: 1, z: 1 }, { x: 1.12, z: 1.12, duration: ROUTE_CONFIG.timing.discActivate, ease: "power1.out" });
    else disc.scale.set(1.12, 1, 1.12);
  }

  private finish(): void {
    this.setState("done");
    this.stopLoop(true);
  }

  private showStatic(withWagon: boolean): void {
    if (!this.road) return;
    this.anim.reveal = 1;
    this.applyReveal();
    this.road.discs.forEach((_, i) => {
      this.visited[i] = true;
      this.activateDisc(i, false);
    });
    if (withWagon && this.wagon) {
      this.anim.wagonAlpha = 1;
      this.anim.distance = this.road.stopDistances[this.road.stopDistances.length - 1];
      this.applyWagonAlpha();
      this.pose(0);
    }
    this.setState("static");
    this.renderOnce();
  }

  // ---------------------------------------------------------------- playback

  private setState(s: PlayState): void {
    if (this.state === s) return;
    this.state = s;
    this.handlers.onState(s);
  }

  private maybeStart(): void {
    if (this.ready && this.visible && this.state === "idle" && this.tl) {
      this.setState("playing");
      this.tl.play();
      this.startLoop();
    }
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    if (!this.tl) return;
    if (!visible) {
      if (this.state === "playing") {
        this.autoPaused = true;
        this.tl.pause();
        this.stopLoop(false);
      }
      return;
    }
    if (this.autoPaused && !this.userPaused && this.state === "playing") {
      this.autoPaused = false;
      this.tl.play();
      this.startLoop();
    }
    this.maybeStart();
  }

  pause(): void {
    if (!this.tl || this.state !== "playing") return;
    this.userPaused = true;
    this.tl.pause();
    this.stopLoop(true);
    this.setState("paused");
  }

  resume(): void {
    if (!this.tl || this.state !== "paused") return;
    this.userPaused = false;
    this.setState("playing");
    if (this.visible) {
      this.tl.play();
      this.startLoop();
    } else this.autoPaused = true;
  }

  replay(): void {
    if (!this.tl || !this.road) return;
    this.tl.pause(0);
    this.visited = this.visited.map(() => false);
    this.road.discs.forEach((d) => {
      d.material.color.copy(this.colors.disc);
      d.material.opacity = 0;
      d.scale.set(1, 1, 1);
    });
    this.anim.reveal = 0;
    this.anim.wagonAlpha = 0;
    this.anim.distance = 0;
    this.lastDistance = 0;
    this.speedSmoothed = 0;
    this.accelSmoothed = 0;
    this.userPaused = false;
    this.autoPaused = false;
    this.handlers.onReset();
    this.tl.invalidate();
    this.setState("playing");
    this.tl.restart();
    this.startLoop();
  }

  private startLoop(): void {
    if (this.raf !== null) return;
    this.lastTime = performance.now();
    const tick = (now: number) => {
      this.raf = null;
      const dt = Math.min(0.1, (now - this.lastTime) / 1000);
      this.lastTime = now;
      this.frame(dt);
      if (this.tl?.isActive() || this.settling()) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private stopLoop(renderFinal: boolean): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
    this.raf = null;
    if (renderFinal) this.renderOnce();
  }

  /** Keep rendering a moment after the timeline stops so a bump/brake response settles visibly. */
  private settling(): boolean {
    return Math.abs(this.speedSmoothed) > 0.05 || Math.abs(this.accelSmoothed) > 0.05;
  }

  private frame(dt: number): void {
    this.applyReveal();
    this.applyWagonAlpha();
    this.pose(dt);
    this.renderer.render(this.scene, this.camera);
  }

  private renderOnce(): void {
    if (this.disposed) return;
    this.frame(0);
  }

  // ---------------------------------------------------------------- layout

  resize(): void {
    if (!this.road) return;
    const rect = this.container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w !== this.width || h !== this.height) {
      this.width = w;
      this.height = h;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ROUTE_CONFIG.render.maxPixelRatio));
      this.renderer.setSize(w, h, false);
    }
    const box = this.road.layout.box;
    const aspect = w / h;
    let fw = box.w;
    let fh = box.h;
    if (aspect > box.w / box.h) fw = box.h * aspect;
    else fh = box.w / aspect;
    this.camera.left = -fw / 2;
    this.camera.right = fw / 2;
    this.camera.top = fh / 2;
    this.camera.bottom = -fh / 2;
    this.camera.position.set(box.w / 2, 60, box.h / 2);
    this.camera.lookAt(box.w / 2, 0, box.h / 2);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    this.reportLabels(fw);
    if (this.raf === null) this.renderOnce();
  }

  private reportLabels(frustumWidth: number): void {
    if (!this.road) return;
    const positions = this.road.discs.map((disc) => {
      this.vP.copy(disc.position).project(this.camera);
      return { x: ((this.vP.x + 1) / 2) * this.width, y: ((1 - this.vP.y) / 2) * this.height };
    });
    this.handlers.onLabels({ positions, unitPx: this.width / frustumWidth });
  }

  /** Switches the point set (phone ↔ desktop) keeping the current segment and its relative progress. */
  setLayout(name: LayoutName): void {
    if (name === this.layoutName || !this.road) return;
    this.layoutName = name;
    if (this.wagon) this.wagon.mover.scale.setScalar(ROUTE_LAYOUTS[name].wagonScale);
    const wasPlaying = this.state === "playing" && !this.autoPaused;
    const t = this.tl ? this.tl.time() : 0;
    let seg = -1;
    let frac = 0;
    for (let i = 0; i < this.segments.length; i++) {
      const s = this.segments[i];
      if (t >= s.start && t < s.start + s.duration) {
        seg = i;
        frac = (t - s.start) / s.duration;
      }
    }
    const afterIntro = t >= this.introDuration;
    this.tl?.pause();
    this.buildRoad(ROUTE_LAYOUTS[name]);
    for (let i = 0; i < this.visited.length; i++) {
      if (this.visited[i]) this.activateDisc(i, false);
      else this.road.discs[i].material.opacity = afterIntro ? 1 : this.road.discs[i].material.opacity;
    }
    if (this.state === "static") {
      this.showStatic(Boolean(this.wagon));
      this.resize();
      return;
    }
    if (this.tl) {
      // Re-express the distance on the new curve before the timeline records its start values.
      if (seg >= 0) this.anim.distance = this.road.stopDistances[seg - 1] ?? 0;
      else if (afterIntro) {
        const done = this.visited.lastIndexOf(true);
        this.anim.distance = done >= 0 ? this.road.stopDistances[done] : 0;
      }
      this.buildTimeline();
      let time = t;
      if (seg >= 0) time = this.segments[seg].start + frac * this.segments[seg].duration;
      else if (afterIntro && this.state !== "done") {
        // Dwelling at a stop: land on the same dwell of the new timeline.
        const done = this.visited.lastIndexOf(true);
        time = done >= 0 ? this.segments[done].start + this.segments[done].duration + 0.001 : this.introDuration;
      } else if (this.state === "done") time = this.tl!.duration();
      this.tl!.seek(Math.min(time, this.tl!.duration()), true);
      this.lastDistance = this.anim.distance;
      if (wasPlaying) {
        this.tl!.play();
        this.startLoop();
      }
    }
    this.resize();
  }

  dispose(): void {
    this.disposed = true;
    this.stopLoop(false);
    this.tl?.kill();
    this.tl = null;
    this.disposeRoad();
    if (this.wagon) {
      this.scene.remove(this.wagon.mover);
      this.wagon.mover.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      this.wagon.materials.forEach((m) => m.dispose());
      this.wagon = null;
    }
    this.shadowPlane.geometry.dispose();
    (this.shadowPlane.material as THREE.Material).dispose();
    this.sun.dispose();
    this.renderer.dispose();
  }
}

/** True when a WebGL context can be created at all (checked before building the scene). */
export function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
