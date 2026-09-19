/**
 * The horseshoe's Three.js scene: one transparent canvas over the footer's upper block, a narrow perspective
 * camera set so the wall (z = 0) is in CSS pixels (1 unit = 1 px, y down = −y), the GLB from Blender hung on
 * a nail, and a floor along the rule that only shows the shadow. It only renders
 * when asked (placement, resize, each step of an animation) — no loop while nothing moves. The hit button
 * is placed over the shoe's projected box after every render so the click and the accessible name live in
 * real HTML. A click (`drop`) lets the nail give: the shoe wobbles, falls to the rule, bounces, lies there a
 * on the floor, rolls to the right until it leans on the window's edge, rests a while and climbs back to
 * its nail (GSAP timeline, config.fall); nothing moves under reduced motion.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
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
  private camera = new THREE.PerspectiveCamera(CFG.camera.fovDeg, 1, 1, 8000);
  /** The nail: position and the swing in the wall's plane. */
  private pivot = new THREE.Group();
  /** Inside the pivot: how the shoe lies (tipped over, turned) once it has fallen. */
  private lay = new THREE.Group();
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
  private sun: THREE.DirectionalLight;
  private wall: THREE.Mesh;
  private floor: THREE.Mesh;
  /** The eye's height above the block's centre (0 while the shoe hangs) and its distance to the wall. */
  private camElev = 0;
  private camDistance = 1000;
  private readonly corner = new THREE.Vector3();
  private env: THREE.Texture | null = null;

  constructor(
    private stage: HTMLElement,
    canvas: HTMLCanvasElement,
    private hit: HTMLElement,
    private reducedMotion: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = CFG.render.exposure;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.pivot.add(this.lay);

    // Light: a soft sky and a warm key from high left, in front of the wall, that throws the shadow.
    const sky = new THREE.HemisphereLight(0xfff6e6, 0x3a2a1c, CFG.render.light.sky);
    this.sun = new THREE.DirectionalLight(0xfff1dc, CFG.render.light.sun);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(CFG.render.shadow.mapSize, CFG.render.shadow.mapSize);
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.normalBias = 0.6;
    this.scene.add(sky, this.sun, this.sun.target, this.pivot, this.nail);

    // Reflections: a room environment baked by PMREM, on the metal only (the wall has no material of its own).
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    this.scene.environment = this.env;
    this.scene.environmentIntensity = CFG.render.envIntensity;

    // The wall: invisible except where the shadow falls (the footer's ink shows through).
    const shadowMat = new THREE.ShadowMaterial({ opacity: CFG.render.shadow.opacity, transparent: true, depthWrite: false });
    this.wall = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
    this.wall.receiveShadow = true;
    // The floor, along the rule, from the wall towards the eye: the same invisible shadow catcher.
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), shadowMat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.scene.add(this.wall, this.floor);
  }

  async init(glbUrl: string): Promise<void> {
    const gltf = await new GLTFLoader().loadAsync(glbUrl);
    if (this.disposed) return;
    const model = gltf.scene;
    model.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        if (o.material instanceof THREE.MeshStandardMaterial) o.material.needsUpdate = true;
      }
    });
    this.modelBox.setFromObject(model);
    this.model = model;
    this.lay.add(model);
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
    shank.castShadow = true;
    head.castShadow = true;
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
    // At this distance the wall's plane is 1 px per unit; the eye looks at the block's centre from its current height.
    this.camera.aspect = this.width / this.height;
    this.camDistance = this.height / 2 / Math.tan(THREE.MathUtils.degToRad(CFG.camera.fovDeg) / 2);
    this.camera.updateProjectionMatrix();
    this.setCamera(0);

    // The wall spans the stage, a little behind the shoe; the floor runs along the rule towards the eye;
    // the key light frames the whole stage in its shadow camera.
    this.wall.scale.set(this.width, this.height, 1);
    this.wall.position.set(this.width / 2, -this.height / 2, -CFG.render.shadow.wallDepthPx);
    this.floor.scale.set(this.width, CFG.floor.depthPx, 1);
    this.floor.position.set(this.width / 2, -this.height, CFG.floor.depthPx / 2 - CFG.render.shadow.wallDepthPx);
    const [sx, sy, sz] = CFG.render.light.sunFrom;
    const reach = Math.max(this.width, this.height);
    this.sun.position.set(sx, sy, sz).normalize().multiplyScalar(reach * 2);
    this.sun.position.add(new THREE.Vector3(this.width / 2, -this.height / 2, 0));
    this.sun.target.position.set(this.width / 2, -this.height / 2, 0);
    const cam = this.sun.shadow.camera;
    cam.left = -reach * 0.75;
    cam.right = reach * 0.75;
    cam.top = reach * 0.75;
    cam.bottom = -reach * 0.75;
    cam.near = 1;
    cam.far = reach * 4;
    cam.updateProjectionMatrix();
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
    this.lay.rotation.set(0, 0, 0);

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

  /** Places the eye at `elev` px above the block's centre, looking at it. */
  private setCamera(elev: number) {
    this.camElev = elev;
    this.camera.position.set(this.width / 2, -this.height / 2 + elev, this.camDistance);
    this.camera.lookAt(this.width / 2, -this.height / 2, 0);
    // Projections outside a render (screenBox) need the eye's matrices current.
    this.camera.updateMatrixWorld(true);
  }

  /** Whether the shoe is hanging still (a click only counts then). */
  get hung(): boolean {
    return Boolean(this.model) && !this.timeline;
  }

  /** The nail gives: wobble, drop, tip over onto the floor, bounce, rest, climb back to the wall. */
  drop() {
    if (!this.model || this.timeline || this.reducedMotion) return;
    const F = CFG.fall;
    const rad = THREE.MathUtils.degToRad;
    const rest = rad(CFG.restTiltDeg);
    // The poses are measured with the eye where it will be once the shoe is down (screen x and y are linear in
    // world x and y at one depth, so two samples give each answer).
    const savedRot = this.pivot.rotation.z;
    const savedPos = this.pivot.position.clone();
    const savedElev = this.camElev;
    this.setCamera(CFG.camera.elevationPx);
    const rollRad = -Math.PI * 2 * F.roll.turns;

    // The floor: the world level at which the shoe, in its final pose, shows whole above the rule.
    this.pivot.rotation.z = 0;
    this.lay.rotation.set(rad(F.landTipDeg), 0, rad(F.landTiltDeg) + rollRad);
    this.pivot.position.set(this.width / 2, 0, F.forwardPx);
    this.poseBox();
    this.pivot.position.y = -this.height - this.box.min.y;
    const y0 = this.screenBox().y1;
    this.pivot.position.y += 50;
    const ky = (this.screenBox().y1 - y0) / 50;
    const lift = (this.height - F.floorMarginPx - y0) / ky;
    const floorLevel = -this.height + lift;
    this.floor.position.y = floorLevel;


    // Where it stops rolling: its rightmost point at the window's edge, in that final pose, measured at its
    // resting height (the eye is pitched down, so screen x also depends on the height of a point).
    this.pivot.position.set(0, 0, F.forwardPx);
    this.poseBox();
    this.pivot.position.y = floorLevel - this.box.min.y;
    const target = this.width - F.roll.edgeInsetPx;
    const at0 = this.screenBox().x1;
    this.pivot.position.x = 100;
    const k = (this.screenBox().x1 - at0) / 100;
    const endX = (target - at0) / k;

    // Where the hole ends up as it lands (before rolling), on that floor.
    this.lay.rotation.set(rad(F.landTipDeg), 0, rad(F.landTiltDeg));
    this.pivot.position.set(this.nailAt.x, 0, F.forwardPx);
    this.poseBox();
    const floorY = floorLevel - this.box.min.y;

    this.lay.rotation.set(0, 0, 0);
    this.pivot.rotation.z = savedRot;
    this.pivot.position.copy(savedPos);
    this.setCamera(savedElev);

    const p = this.pivot.position;
    const r = this.pivot.rotation;
    const l = this.lay.rotation;
    const dropH = this.nailAt.y - floorY;
    const fall = F.fallMs / 1000;
    // While rolling, whatever the turn, the lowest point of the shoe stays on the floor.
    const settle = () => {
      this.poseBox();
      p.y += floorLevel - this.box.min.y;
    };
    // Rolling: on the floor, and never past the window's edge (the prediction is checked against the eye's view).
    const rollStep = () => {
      settle();
      for (let i = 0; i < 3; i++) {
        const over = this.screenBox().x1 - target;
        if (over <= 0) break;
        p.x -= over;
      }
    };
    const eye = () => this.setCamera(this.camElev);
    const tl = gsap.timeline({
      onUpdate: () => this.requestRender(),
      onComplete: () => {
        this.timeline = null;
        this.requestRender();
      },
    });
    const s = F.swingMs / 1000;
    tl.to(r, { z: rest - rad(F.swingDeg), duration: s * 0.4, ease: "power2.out" })
      .to(r, { z: rest + rad(F.swingDeg * 0.6), duration: s * 0.35, ease: "power1.inOut" })
      .to(r, { z: rest, duration: s * 0.25, ease: "power1.in" })
      // The drop: down and out from the wall, tipping over and turning; the swing's angle moves into the lie.
      .to(p, { y: floorY, duration: fall, ease: "power2.in" }, "fall")
      .to(p, { x: this.nailAt.x - dropH * 0.06, z: F.forwardPx, duration: fall, ease: "power1.in" }, "fall")
      .to(r, { z: 0, duration: fall, ease: "power1.in" }, "fall")
      .to(l, { x: rad(F.landTipDeg) * 0.8, z: rad(F.landTiltDeg) * 0.7, duration: fall, ease: "power1.in" }, "fall")
      // The eye rises with the fall, to see the floor from above.
      .to(this, { camElev: CFG.camera.elevationPx, duration: fall * 1.4, ease: "power1.inOut", onUpdate: eye }, "fall");
    F.bounces.forEach((b, i) => {
      const up = b.ms / 2000;
      const last = i === F.bounces.length - 1;
      tl.to(p, { y: floorY + dropH * b.share, duration: up, ease: "power2.out" })
        .to(l, { x: rad(F.landTipDeg) * (last ? 1 : 0.92), z: rad(F.landTiltDeg) * (last ? 1 : 0.88), duration: up * 2, ease: "power1.inOut" }, "<")
        .to(p, { y: floorY, duration: up, ease: "power2.in" });
    });
    tl.to(p, { x: endX + 40, duration: F.roll.ms / 1000, ease: "power2.out", onUpdate: rollStep }, "roll")
      .to(l, { z: rad(F.landTiltDeg) + rollRad, duration: F.roll.ms / 1000, ease: "power2.out" }, "roll")
      .to({}, { duration: F.restMs / 1000 })
      // Back to the wall and its nail.
      .to(p, { x: this.nailAt.x, y: this.nailAt.y, z: 0, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise")
      .to(l, { x: 0, z: 0, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise")
      .to(r, { z: rest, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise")
      .to(this, { camElev: 0, duration: F.riseMs / 1000, ease: "power2.inOut", onUpdate: eye }, "rise");
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

  /** The shoe's world box for the pose set right now (the children's matrices are brought up to date first:
      Box3.setFromObject alone would measure the pose of the last render). */
  private poseBox() {
    this.pivot.updateMatrixWorld(true);
    this.box.setFromObject(this.pivot);
    return this.box;
  }

  /** The shoe's box on screen (CSS px of the stage): its eight world corners through the camera. */
  private screenBox() {
    this.poseBox();
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < 8; i++) {
      this.corner.set(i & 1 ? this.box.max.x : this.box.min.x, i & 2 ? this.box.max.y : this.box.min.y, i & 4 ? this.box.max.z : this.box.min.z).project(this.camera);
      const x = ((this.corner.x + 1) / 2) * this.width;
      const y = ((1 - this.corner.y) / 2) * this.height;
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    return { x0, y0, x1, y1 };
  }

  /** The real button follows the shoe's box on screen. */
  private placeHit() {
    if (!this.model) return;
    const { x0, y0, x1, y1 } = this.screenBox();
    const s = this.hit.style;
    s.left = `${x0.toFixed(1)}px`;
    s.top = `${y0.toFixed(1)}px`;
    s.width = `${(x1 - x0).toFixed(1)}px`;
    s.height = `${(y1 - y0).toFixed(1)}px`;
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
    this.env?.dispose();
    this.renderer.dispose();
  }
}
