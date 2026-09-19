/**
 * The horseshoe's Three.js scene: one transparent canvas over the footer's upper block, a narrow perspective
 * camera set so the wall (z = 0) is in CSS pixels (1 unit = 1 px, y down = −y), the GLB from Blender hung on
 * a nail, and a floor along the rule that only shows the shadow. It only renders
 * when asked (placement, resize, each step of an animation) — no loop while nothing moves. The hit button
 * is placed over the shoe's projected box after every render so the click and the accessible name live in
 * real HTML. A double click (`drop`) and the shoe lets go of its nail, which stays on the wall: it falls straight
 * down to the rule, bounces twice, falls over backwards, lies there a while and climbs back to its nail
 * (GSAP timeline, config.fall); nothing moves under reduced motion.
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
  /** The eye that never rises: the nail is always drawn from it, so it stays exactly where it is on the wall. */
  private nailCamera = new THREE.PerspectiveCamera(CFG.camera.fovDeg, 1, 1, 8000);
  /** The nail: position and the swing in the wall's plane. */
  private pivot = new THREE.Group();
  /** Inside the pivot: how the shoe lies (tipped over, turned) once it has fallen. */
  private lay = new THREE.Group();
  private model: THREE.Object3D | null = null;
  private meshes: THREE.Mesh[] = [];
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
  /** Where the hanging shoe's centre is across the stage (the eye moves in front of it as it rises). */
  private shoeX = 0;
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
        this.meshes.push(o);
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
    this.camDistance = this.height / 2 / Math.tan(THREE.MathUtils.degToRad(CFG.camera.fovDeg) / 2);
    this.setCamera(0);
    this.aim(this.nailCamera, 0);

    // The wall spans the stage, a little behind the shoe; the floor runs along the rule, to both sides of the wall's foot
    // (the shoe falls over backwards, past the wall's plane: the wall is only there to catch the shadow);
    // the key light frames the whole stage in its shadow camera.
    this.wall.scale.set(this.width, this.height, 1);
    this.wall.position.set(this.width / 2, -this.height / 2, -CFG.render.shadow.wallDepthPx);
    this.floor.scale.set(this.width, CFG.floor.depthPx * 2, 1);
    this.floor.position.set(this.width / 2, -this.height, 0);
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
    this.poseBox();
    this.shoeX = (this.box.min.x + this.box.max.x) / 2;
    this.requestRender();
  }

  /** Places the eye at `elev` px above the block's centre, looking at it. As it rises it also moves across, from
      the block's centre to right in front of the shoe, so the shoe falls over towards its own vanishing point
      and keeps its place across the window; the view is offset to match, so the wall stays 1:1 where it was. */
  private setCamera(elev: number) {
    this.camElev = elev;
    this.aim(this.camera, elev);
  }

  private aim(camera: THREE.PerspectiveCamera, elev: number) {
    const x = THREE.MathUtils.lerp(this.width / 2, this.shoeX, elev / CFG.camera.elevationPx);
    camera.aspect = (this.width * 2) / this.height;
    camera.setViewOffset(this.width * 2, this.height, this.width - x, 0, this.width, this.height);
    camera.position.set(x, -this.height / 2 + elev, this.camDistance);
    camera.lookAt(x, -this.height / 2, 0);
    // Projections outside a render (screenBox) need the eye's matrices current.
    camera.updateMatrixWorld(true);
  }

  /** Whether the shoe is hanging still (it only lets go then). */
  get hung(): boolean {
    return Boolean(this.model) && !this.timeline;
  }

  /** The shoe lets go of its nail (which never moves): it drops straight down, bounces twice, stands, falls over
      backwards, rests there and climbs back. */
  drop() {
    if (!this.model || this.timeline || this.reducedMotion) return;
    const F = CFG.fall;
    const rad = THREE.MathUtils.degToRad;
    const rest = rad(CFG.restTiltDeg);
    const tip = rad(F.landTipDeg);
    const tilt = rad(F.landTiltDeg);
    const p = this.pivot.position;
    const r = this.pivot.rotation;
    const l = this.lay.rotation;

    // Hanging: where its centre is across the wall (it keeps it all the way down).
    this.poseBox();
    const centreX = (this.box.min.x + this.box.max.x) / 2;
    const keepX = () => {
      this.poseBox();
      p.x += centreX - (this.box.min.x + this.box.max.x) / 2;
    };
    // Standing as it lands, seen head-on: on the rule, and the foremost point it stands on.
    const savedRot = r.z;
    const savedPos = p.clone();
    r.z = 0;
    l.set(0, 0, tilt);
    keepX();
    this.ground();
    const landX = p.x;
    const landY = p.y;
    const frontZ = this.box.max.z;
    this.floor.position.y = this.poseBox().min.y;
    l.set(0, 0, 0);
    r.z = savedRot;
    p.copy(savedPos);

    const dropH = this.nailAt.y - landY;
    const fall = F.fallMs / 1000;
    // Falling over, whatever the angle and wherever the eye: the point it stands on stays put, its lowest point
    // on screen stays on the rule, and the floor (the shadow) under it.
    const topple = () => {
      this.setCamera(this.camElev);
      this.poseBox();
      p.z += frontZ - this.box.max.z;
      this.ground();
      this.floor.position.y = this.poseBox().min.y;
    };
    const tl = gsap.timeline({
      onUpdate: () => this.requestRender(),
      onComplete: () => {
        this.timeline = null;
        this.requestRender();
      },
    });
    if (F.swingMs > 0) {
      const s = F.swingMs / 1000;
      tl.to(r, { z: rest - rad(F.swingDeg), duration: s * 0.5, ease: "power2.out" })
        .to(r, { z: rest, duration: s * 0.5, ease: "power1.in" });
    }
    // The drop: straight down under gravity (x and z stay), turning about its own centre towards its arch.
    tl.to(p, { y: landY, duration: fall, ease: "power1.in" }, "fall")
      .to(r, { z: 0, duration: fall, ease: "sine.in" }, "fall")
      .to(l, { z: tilt - rad(F.rockDeg), duration: fall, ease: "sine.in", onUpdate: keepX }, "fall");
    // The bounces: parabolas whose duration follows from their height; the shoe rocks on its arch and settles.
    let at = fall;
    F.bounces.forEach((share, i) => {
      const up = fall * Math.sqrt(share);
      const rock = i === 0 ? rad(F.rockDeg) * 0.5 : 0;
      tl.to(p, { y: landY + dropH * share, duration: up, ease: "power1.out" }, `fall+=${at}`)
        .to(p, { y: landY, duration: up, ease: "power1.in" }, `fall+=${at + up}`)
        .to(l, { z: tilt + rock, duration: up * 2, ease: "sine.inOut", onUpdate: keepX }, `fall+=${at}`);
      at += up * 2;
    });
    // Standing on the rule; then over backwards, slowly at first and a little faster as it goes, while the eye
    // rises to see it lie there.
    at += F.standMs / 1000;
    const tipS = F.tipMs / 1000;
    tl.set(p, { x: landX, y: landY }, `fall+=${at}`)
      .to(l, { x: tip, duration: tipS, ease: F.tipEase, onUpdate: topple }, `fall+=${at}`)
      .to(this, { camElev: CFG.camera.elevationPx, duration: tipS, ease: "sine.inOut" }, `fall+=${at}`)
      .to({}, { duration: F.restMs / 1000 })
      // Back to the wall and its nail.
      .to(p, { x: this.nailAt.x, y: this.nailAt.y, z: 0, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise")
      .to(l, { x: 0, z: 0, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise")
      .to(r, { z: rest, duration: F.riseMs / 1000, ease: "power2.inOut" }, "rise")
      .to(this, { camElev: 0, duration: F.riseMs / 1000, ease: "power2.inOut", onUpdate: () => this.setCamera(this.camElev) }, "rise");
    this.timeline = tl;
  }

  /** Moves the shoe up or down until its lowest point on screen sits on the rule (for the eye as it is now). */
  private ground() {
    const target = this.height - CFG.fall.floorMarginPx;
    for (let i = 0; i < 3; i++) this.pivot.position.y += this.screenBox().y1 - target;
  }

  requestRender() {
    if (this.frame || this.disposed) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      this.render();
    });
  }

  private render() {
    if (this.camElev === 0) {
      this.renderer.render(this.scene, this.camera);
    } else {
      // The eye is up: the shoe and its floor from there, then the nail (and its shadow) on top from the level
      // eye, as it is drawn while the shoe hangs — the nail does not move whatever the shoe does.
      this.nail.visible = false;
      this.renderer.render(this.scene, this.camera);
      this.nail.visible = true;
      this.pivot.visible = false;
      this.floor.visible = false;
      this.renderer.autoClear = false;
      this.renderer.clearDepth();
      this.renderer.render(this.scene, this.nailCamera);
      this.renderer.autoClear = true;
      this.pivot.visible = true;
      this.floor.visible = true;
    }
    this.placeHit();
  }

  /** The shoe's world box for the pose set right now, from its vertices (the box of a turned bounding box would
      overstate it). The children's matrices are brought up to date first: Box3.setFromObject alone would measure
      the pose of the last render. */
  private poseBox() {
    this.pivot.updateMatrixWorld(true);
    this.box.setFromObject(this.pivot, true);
    return this.box;
  }

  /** The shoe's box on screen (CSS px of the stage): its vertices through the camera. */
  private screenBox() {
    this.pivot.updateMatrixWorld(true);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const mesh of this.meshes) {
      const at = mesh.geometry.getAttribute("position");
      for (let i = 0; i < at.count; i++) {
        this.corner.fromBufferAttribute(at, i).applyMatrix4(mesh.matrixWorld).project(this.camera);
        const x = ((this.corner.x + 1) / 2) * this.width;
        const y = ((1 - this.corner.y) / 2) * this.height;
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
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
