/**
 * Cube carousel — rotation, drag and face assignment (GSAP + Draggable), no React here.
 *
 * Single source of truth: `state.rot`, the cube's rotationY in degrees, unbounded. From it:
 *   position p = −rot / 90 (a float: 2.5 is half way between items 2 and 3);
 *   side f shows the item j ≡ f (mod 4) closest to p, so the two sides that can be seen always
 *   carry ⌊p⌋ and ⌈p⌉, and a side only changes its item while it is exactly at the back;
 *   the front item is round(p), wrapped over the item count.
 * The component renders what `onAssign` / `onFront` report; this class only writes two custom
 * properties: --cube-rot on the cube and --cube-shade on every lit surface.
 */
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { CUBE_CONFIG } from "./config";

gsap.registerPlugin(Draggable);

export type CubeEngineOptions = {
  /** Element that takes the drag (the example's #dragger: here the stage itself). */
  stage: HTMLElement;
  cube: HTMLElement;
  /** Lit surfaces and the angle (deg) of their normal from side 0: the four sides and the edge facets. */
  surfaces: { el: HTMLElement; angle: number }[];
  count: number;
  reducedMotion: boolean;
  /** Item index (unwrapped modulo count) for each side. */
  onAssign: (items: number[]) => void;
  onFront: (index: number) => void;
  /** First pointer/keyboard/button interaction (autoplay is over; announcements may start). */
  onInteract: () => void;
};

const mod = (a: number, n: number) => ((a % n) + n) % n;

export class CubeEngine {
  private state = { rot: 0 };
  private target = 0;
  private assigned: number[] = [];
  private front = -1;
  private draggable: Draggable | null = null;
  private auto: gsap.core.Tween | null = null;
  private visible = false;
  private held = false;
  private interacted = false;
  private samples: { t: number; x: number }[] = [];
  private lastX = 0;
  private dragStartRot = 0;
  private degPerPx = 0.3;

  constructor(private o: CubeEngineOptions) {
    this.apply();
    const cfg = CUBE_CONFIG.drag;
    const engine = this;
    // The example drags an invisible layer and resets it on release; a detached proxy with the
    // stage as trigger does the same without moving anything on the page.
    this.draggable = Draggable.create(document.createElement("div"), {
      trigger: o.stage,
      type: "x",
      minimumMovement: cfg.minimumMovement,
      // The cursor is the stylesheet's business (the site may replace the native one).
      cursor: false as unknown as string, // Draggable accepts `false` (no inline cursor); its typings only say string.
      onPress() {
        engine.interact();
        engine.lastX = this.x;
        engine.samples = [{ t: performance.now(), x: this.x }];
        engine.dragStartRot = engine.target;
        engine.degPerPx = 90 / Math.max(1, o.cube.offsetWidth * cfg.widthsPerQuarterTurn);
      },
      onDrag() {
        const dx = this.x - engine.lastX;
        engine.lastX = this.x;
        const now = performance.now();
        engine.samples.push({ t: now, x: this.x });
        while (engine.samples.length > 2 && now - engine.samples[0].t > 120) engine.samples.shift();
        engine.target += dx * engine.degPerPx;
        engine.tweenTo(engine.target, o.reducedMotion ? 0 : cfg.follow, "power2.out");
      },
      onDragEnd() {
        engine.release();
        gsap.set(this.target, { x: 0 });
        this.update();
      },
    })[0];
  }

  // ---------------------------------------------------------------- pose

  private apply(): void {
    const { rot } = this.state;
    this.o.cube.style.setProperty("--cube-rot", `${rot.toFixed(3)}deg`);
    const { towardsRight, towardsLeft } = CUBE_CONFIG.shade;
    for (const s of this.o.surfaces) {
      // Signed angle between the surface normal and the viewer, in (−180, 180]; + is turned to the right.
      const a = mod(rot + s.angle + 180, 360) - 180;
      const away = Math.min(Math.abs(a), 90) / 90;
      s.el.style.setProperty("--cube-shade", (away * (a > 0 ? towardsRight : towardsLeft)).toFixed(3));
    }
    const p = -rot / 90;
    const n = CUBE_CONFIG.faces;
    const next = Array.from({ length: n }, (_, f) => mod(f + n * Math.round((p - f) / n), this.o.count));
    if (next.some((v, i) => v !== this.assigned[i])) {
      this.assigned = next;
      this.o.onAssign(next);
    }
    const front = mod(Math.round(p), this.o.count);
    if (front !== this.front) {
      this.front = front;
      this.o.onFront(front);
    }
  }

  private tweenTo(rot: number, duration: number, ease: string): void {
    gsap.to(this.state, { rot, duration, ease, overwrite: true, onUpdate: () => this.apply() });
    if (duration === 0) this.apply();
  }

  /** Release: throw with part of the pointer speed, then rest on the nearest side. */
  private release(): void {
    const cfg = CUBE_CONFIG.drag;
    const a = this.samples[0];
    const b = this.samples[this.samples.length - 1];
    const speed = b && a && b.t > a.t ? ((b.x - a.x) / (b.t - a.t)) * 1000 : 0;
    const thrown = this.target + speed * cfg.throwSeconds * this.degPerPx;
    const startStep = Math.round(this.dragStartRot / 90);
    let step = Math.round(thrown / 90);
    const moved = this.target - this.dragStartRot;
    if (step === startStep && Math.abs(moved) > cfg.advanceAfterDeg) step += Math.sign(moved);
    step = Math.min(startStep + cfg.maxThrowSteps, Math.max(startStep - cfg.maxThrowSteps, step));
    this.target = step * 90;
    this.tweenTo(this.target, this.o.reducedMotion ? 0 : cfg.settle, "power3.out");
  }

  // ---------------------------------------------------------------- api

  /** +1 shows the next item (the cube turns to the left), −1 the previous one. */
  step(direction: 1 | -1, fromUser = true): void {
    if (fromUser) this.interact();
    this.target = Math.round(this.target / 90) * 90 - direction * 90;
    this.tweenTo(this.target, this.o.reducedMotion ? 0 : CUBE_CONFIG.step.duration, CUBE_CONFIG.step.ease);
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
    this.auto?.kill();
    gsap.killTweensOf(this.state);
    this.draggable?.kill();
    this.draggable = null;
  }
}
