/**
 * Cube carousel — rotation, drag and side assignment (GSAP + Draggable), no React here.
 *
 * State: `rot` (rotationY, degrees, unbounded), `tilt` (rotationX, only non-zero during a roll)
 * and `rolls` (net vertical steps taken). From them:
 *   horizontal position p = −rot / 90, item position c = p + rolls;
 *   side f shows the item whose horizontal slot j ≡ f (mod 4) is closest to p (so the two sides
 *   that can be seen always carry ⌊c⌋ and ⌈c⌉, and a side only changes while it is at the back);
 *   the step between c and c+1 is a roll when (c + 1) is a multiple of `verticalEvery`.
 * A roll brings the top (forward) or bottom (back) side to the front with the incoming item;
 * when it lands, `rolls` absorbs the step, the front side takes that same item unseen, and the
 * tilt returns to 0 — the picture does not change, the cube is simply upright again.
 *
 * A click on the front side is reported as a shot (`onShot`); turning is left to drag, arrows and keys.
 *
 * The component renders what `onAssign` / `onCap` / `onFront` / `onShot` report; this class only writes
 * custom properties: --cube-rot, --cube-tilt, --cube-spin, --cube-scale on the cube and
 * --cube-shade / --cube-sheen on every side.
 */
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { CUBE_CONFIG } from "./config";

gsap.registerPlugin(Draggable);

export type CubeEngineOptions = {
  /** Element that takes the drag (the example's #dragger: here the stage itself). */
  stage: HTMLElement;
  cube: HTMLElement;
  /** The four sides around the vertical axis, in order (side f faces the viewer at rot = −90·f). */
  sides: HTMLElement[];
  top: HTMLElement;
  bottom: HTMLElement;
  count: number;
  reducedMotion: boolean;
  /** Item index (wrapped over count) for each of the four sides. */
  onAssign: (items: number[]) => void;
  /** Item carried by the top / bottom side during a roll. */
  onCap: (cap: { top: number; bottom: number }) => void;
  onFront: (index: number) => void;
  /** First pointer/keyboard/button interaction (autoplay is over; announcements may start). */
  onInteract: () => void;
  /** A click or tap landed on the side facing the visitor while the cube stood square: item hit, point in 0..1 of the side. */
  onShot: (shot: { item: number; x: number; y: number }) => void;
};

const mod = (a: number, n: number) => ((a % n) + n) % n;
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

export class CubeEngine {
  private state = { rot: 0, tilt: 0 };
  private target = 0;
  /** Still in the page-load pose (CUBE_CONFIG.initialTurn): rot is off its target with no tween running. */
  private askew = false;
  private rolls = 0;
  private rolling = false;
  /** Between a roll landing and the cube standing upright again: `rolls` already counts the step. */
  private absorbed = false;
  private dragging = false;
  private queue: (1 | -1)[] = [];
  private assigned: number[] = [];
  private front = -1;
  private draggable: Draggable | null = null;
  private auto: gsap.core.Tween | null = null;
  private visible = false;
  private held = false;
  private interacted = false;
  private disposed = false;
  // Drag gesture.
  private samples: { t: number; x: number }[] = [];
  private lastX = 0;
  private pressX = 0;
  private dragMode: "idle" | "turn" | "roll" | "locked" = "idle";
  private rollDir: 1 | -1 = 1;
  private dragStartRot = 0;
  private degPerPx = 0.3;

  constructor(private o: CubeEngineOptions) {
    if (o.count > 1) {
      this.state.rot = -CUBE_CONFIG.initialTurn;
      this.askew = true;
    }
    this.apply();
    const cfg = CUBE_CONFIG.drag;
    const engine = this;
    // The example drags an invisible layer and resets it on release; a detached proxy with the
    // stage as trigger does the same without moving anything on the page.
    this.draggable = Draggable.create(document.createElement("div"), {
      trigger: o.stage,
      type: "x",
      minimumMovement: cfg.minimumMovement,
      cursor: false as unknown as string, // Draggable accepts `false` (no inline cursor); its typings only say string.
      onPress() {
        engine.interact();
        engine.lastX = engine.pressX = this.x;
        engine.samples = [{ t: performance.now(), x: this.x }];
        engine.dragMode = engine.rolling ? "locked" : "idle";
        engine.dragStartRot = engine.target;
        engine.degPerPx = 90 / Math.max(1, o.cube.offsetWidth * cfg.widthsPerQuarterTurn);
      },
      onDragStart() {
        engine.dragging = true;
      },
      onDrag() {
        engine.drag(this.x);
      },
      onDragEnd() {
        engine.release();
        gsap.set(this.target, { x: 0 });
        this.update();
      },
    })[0];
    // A plain click or tap on the cube shoots it (Draggable swallows the click that ends a drag).
    o.stage.addEventListener("click", this.onStageClick);
  }

  /** Only a cube standing square is hit: its front side then lies in the scene's plane at its true size, so the scene's box is the side's. */
  private onStageClick = (e: MouseEvent): void => {
    if (this.dragging || this.rolling || this.state.tilt !== 0 || Math.abs(this.state.rot - this.target) > 1) return;
    const box = this.o.cube.parentElement?.getBoundingClientRect();
    if (!box || !box.width || !box.height) return;
    const x = (e.clientX - box.left) / box.width;
    const y = (e.clientY - box.top) / box.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    this.o.onShot({ item: this.front, x, y });
  };

  // ---------------------------------------------------------------- pose

  /** Item position of the horizontal target, once every pending turn has landed. */
  private restItem(): number {
    return Math.round(-this.target / 90) + this.rolls;
  }

  /** True when the step from item `c` in `dir` crosses a vertical boundary. */
  private isRoll(c: number, dir: 1 | -1): boolean {
    const every = CUBE_CONFIG.verticalEvery;
    return dir > 0 ? mod(c + 1, every) === 0 : mod(c, every) === 0;
  }

  private apply(): void {
    const { rot, tilt } = this.state;
    const { cube, sides, top, bottom, count } = this.o;
    const { towardsRight, towardsLeft, vertical } = CUBE_CONFIG.shade;
    const lean = Math.abs(tilt) / 90;
    cube.style.setProperty("--cube-rot", `${rot.toFixed(3)}deg`);
    cube.style.setProperty("--cube-tilt", `${tilt.toFixed(3)}deg`);
    cube.style.setProperty("--cube-scale", (1 - CUBE_CONFIG.roll.dip * Math.sin(lean * Math.PI)).toFixed(4));
    sides.forEach((el, f) => {
      // Signed angle between the side's normal and the viewer, in (−180, 180]; + is turned to the right.
      const a = mod(rot + f * 90 + 180, 360) - 180;
      const away = Math.min(Math.abs(a), 90) / 90;
      const shade = Math.max(away * (a > 0 ? towardsRight : towardsLeft), lean * vertical);
      el.style.setProperty("--cube-shade", shade.toFixed(3));
      // The reflection slides across the side as it turns (and with the roll).
      el.style.setProperty("--cube-sheen", `${(50 + (a / 90) * 70 + lean * 40).toFixed(2)}%`);
    });
    for (const cap of [top, bottom]) {
      cap.style.setProperty("--cube-shade", ((1 - lean) * vertical).toFixed(3));
      cap.style.setProperty("--cube-sheen", `${(10 + lean * 40).toFixed(2)}%`);
    }
    const p = -rot / 90;
    const n = CUBE_CONFIG.faces;
    const next = sides.map((_, f) => mod(f + n * Math.round((p - f) / n) + this.rolls, count));
    if (next.some((v, i) => v !== this.assigned[i])) {
      this.assigned = next;
      this.o.onAssign(next);
    }
    const item = Math.round(p) + this.rolls + (lean > 0.5 && !this.absorbed ? Math.sign(-tilt) : 0);
    const front = mod(item, count);
    if (front !== this.front) {
      this.front = front;
      this.o.onFront(front);
    }
  }

  private tweenRot(rot: number, duration: number, ease: string): void {
    gsap.to(this.state, { rot, duration, ease, overwrite: "auto", onUpdate: () => this.apply(), onComplete: () => this.pump() });
    if (duration === 0) {
      this.apply();
      this.pump();
    }
  }

  // ---------------------------------------------------------------- roll (vertical step)

  /** Loads the incoming item on the top (forward) or bottom (back) side; upright whatever the cube's heading. */
  private prepareRoll(dir: 1 | -1): void {
    const c = this.restItem();
    const incoming = mod(c + dir, this.o.count);
    this.o.cube.style.setProperty("--cube-spin", `${Math.round(this.target)}deg`);
    this.o.onCap({ top: incoming, bottom: incoming });
  }

  private roll(dir: 1 | -1, from = 0): void {
    this.rolling = true;
    if (from === 0) this.prepareRoll(dir);
    const { duration, ease } = CUBE_CONFIG.roll;
    // Forward: the top side comes to the front (tilt → −90). Back: the bottom side (tilt → +90).
    const left = 1 - Math.abs(from) / 90;
    gsap.to(this.state, {
      tilt: -dir * 90,
      duration: this.o.reducedMotion ? 0 : duration * Math.max(0.35, left),
      ease: from === 0 ? ease : "power3.out",
      overwrite: "auto",
      onUpdate: () => this.apply(),
      onComplete: () => void this.land(dir),
    });
  }

  /** The roll has landed: hand the item to the front side (unseen, it now faces down/up), then stand upright. */
  private async land(dir: 1 | -1): Promise<void> {
    this.rolls += dir;
    this.absorbed = true;
    this.apply();
    await nextFrame();
    await nextFrame();
    const frontSide = this.o.sides[mod(Math.round(-this.state.rot / 90), CUBE_CONFIG.faces)];
    const img = frontSide?.querySelector("img");
    if (img) await img.decode().catch(() => {});
    if (this.disposed) return;
    this.state.tilt = 0;
    this.absorbed = false;
    this.rolling = false;
    this.apply();
    this.pump();
  }

  private cancelRoll(): void {
    gsap.to(this.state, {
      tilt: 0,
      duration: this.o.reducedMotion ? 0 : 0.45,
      ease: "power3.out",
      overwrite: "auto",
      onUpdate: () => this.apply(),
      onComplete: () => {
        this.rolling = false;
        this.apply();
        this.pump();
      },
    });
  }

  // ---------------------------------------------------------------- drag

  private drag(x: number): void {
    const cfg = CUBE_CONFIG.drag;
    this.askew = false; // the release always rests the cube on a side
    const dx = x - this.lastX;
    this.lastX = x;
    const now = performance.now();
    this.samples.push({ t: now, x });
    while (this.samples.length > 2 && now - this.samples[0].t > 120) this.samples.shift();
    if (this.dragMode === "locked") return;
    if (this.dragMode === "idle") {
      // Dragging left asks for the next item. At a vertical boundary the same gesture rolls the cube.
      const dir: 1 | -1 = x - this.pressX < 0 ? 1 : -1;
      const settled = Math.abs(this.state.rot - this.target) < 1;
      if (settled && this.isRoll(this.restItem(), dir)) {
        this.dragMode = "roll";
        this.rollDir = dir;
        this.rolling = true;
        this.queue.length = 0;
        this.prepareRoll(dir);
      } else this.dragMode = "turn";
    }
    if (this.dragMode === "roll") {
      const travelled = Math.max(0, (this.pressX - x) * this.rollDir) * this.degPerPx;
      const tilt = -this.rollDir * Math.min(90, travelled);
      gsap.to(this.state, { tilt, duration: this.o.reducedMotion ? 0 : cfg.follow, ease: "power2.out", overwrite: "auto", onUpdate: () => this.apply() });
      return;
    }
    // Horizontal turn, kept inside the run of items between two vertical boundaries.
    const every = CUBE_CONFIG.verticalEvery;
    const c0 = Math.round(-this.dragStartRot / 90) + this.rolls;
    const lo = Math.floor(c0 / every) * every;
    const pMin = lo - this.rolls - cfg.overshoot;
    const pMax = lo + every - 1 - this.rolls + cfg.overshoot;
    const p = Math.min(pMax, Math.max(pMin, -(this.target + dx * this.degPerPx) / 90));
    this.target = -p * 90;
    gsap.to(this.state, { rot: this.target, duration: this.o.reducedMotion ? 0 : cfg.follow, ease: "power2.out", overwrite: "auto", onUpdate: () => this.apply() });
  }

  /** Release: throw with part of the pointer speed, then rest on the nearest side. */
  private release(): void {
    const cfg = CUBE_CONFIG.drag;
    const a = this.samples[0];
    const b = this.samples[this.samples.length - 1];
    const speed = b && a && b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
    const mode = this.dragMode;
    this.dragMode = "idle";
    this.dragging = false;
    if (mode === "roll") {
      const thrown = Math.abs(this.state.tilt) + Math.max(0, -speed * this.rollDir) * cfg.throwSeconds * this.degPerPx;
      if (thrown > cfg.advanceAfterDeg) this.roll(this.rollDir, this.state.tilt);
      else this.cancelRoll();
      return;
    }
    if (mode !== "turn") {
      this.pump();
      return;
    }
    const every = CUBE_CONFIG.verticalEvery;
    const c0 = Math.round(-this.dragStartRot / 90) + this.rolls;
    const lo = Math.floor(c0 / every) * every;
    const startStep = Math.round(this.dragStartRot / 90);
    let step = Math.round((this.target + speed * cfg.throwSeconds * this.degPerPx) / 90);
    const moved = this.target - this.dragStartRot;
    if (step === startStep && Math.abs(moved) > cfg.advanceAfterDeg) step += Math.sign(moved);
    // Stay inside the run: −step is the horizontal position.
    const pMin = lo - this.rolls;
    const pMax = lo + every - 1 - this.rolls;
    step = -Math.min(pMax, Math.max(pMin, -step));
    this.target = step * 90;
    this.tweenRot(this.target, this.o.reducedMotion ? 0 : cfg.settle, "power3.out");
  }

  // ---------------------------------------------------------------- api

  /** +1 shows the next item, −1 the previous one; turns and rolls are queued in order. */
  step(direction: 1 | -1, fromUser = true): void {
    if (fromUser) this.interact();
    if (this.queue.length < 6) this.queue.push(direction);
    this.pump();
  }

  /** Runs the queue: turns may overlap (the tween is simply retargeted), a roll waits until the cube is square. */
  private pump(): void {
    if (this.rolling || this.dragging || this.disposed) return;
    while (this.queue.length) {
      const dir = this.queue[0];
      if (this.isRoll(this.restItem(), dir)) {
        if (this.askew) {
          // Nothing is turning yet: square the cube first, its onComplete pumps the roll.
          this.askew = false;
          this.tweenRot(this.target, this.o.reducedMotion ? 0 : 0.4, "power2.out");
          return;
        }
        if (Math.abs(this.state.rot - this.target) > 0.05) return; // the turn's onComplete pumps again
        this.queue.shift();
        this.roll(dir);
        return;
      }
      this.queue.shift();
      this.askew = false;
      this.target = Math.round(this.target / 90) * 90 - dir * 90;
      this.tweenRot(this.target, this.o.reducedMotion ? 0 : CUBE_CONFIG.step.duration, CUBE_CONFIG.step.ease);
      if (this.o.reducedMotion) return;
    }
  }

  private interact(): void {
    if (this.interacted) return;
    this.interacted = true;
    this.auto?.kill();
    this.auto = null;
    this.o.onInteract();
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
    this.schedule(CUBE_CONFIG.autoplay.firstDelay);
  }

  /** Hover or focus inside the component holds the idle turning. */
  setHeld(held: boolean): void {
    this.held = held;
    this.schedule(CUBE_CONFIG.autoplay.interval);
  }

  private schedule(delay: number): void {
    this.auto?.kill();
    this.auto = null;
    const { enabled, interval } = CUBE_CONFIG.autoplay;
    if (!enabled || this.interacted || this.o.reducedMotion || !this.visible || this.held || this.o.count < 2) return;
    this.auto = gsap.delayedCall(delay, () => {
      this.step(1, false);
      this.schedule(interval);
    });
  }

  dispose(): void {
    this.disposed = true;
    this.auto?.kill();
    gsap.killTweensOf(this.state);
    this.o.stage.removeEventListener("click", this.onStageClick);
    this.draggable?.kill();
    this.draggable = null;
  }
}
