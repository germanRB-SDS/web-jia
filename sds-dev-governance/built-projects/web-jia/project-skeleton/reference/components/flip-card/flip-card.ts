/**
 * The flip engine: plain DOM, no React. `open()` turns the card once about its vertical axis, from its front to its
 * front: it slows down to a stop on its back, stays there a moment and goes on softly; once there, with a fine
 * pointer, the card leans softly towards the pointer (quick setters fed from GSAP's ticker, easing a share of the way
 * each frame). `close()` stops everything and leaves the card on its front without animating, ready for the next
 * opening. The pointer is listened to on the surface given (the dialog), only between the end of the turn and `close()`.
 */
import gsap from "gsap";
import { FLIP } from "./config";

const STEP_S = 0.005;

/**
 * The angle turned (degrees, 0 → 360) every STEP_S seconds. To its back the speed is V·(1 − u^slowdown), which starts
 * at V = 180·(slowdown + 1) / slowdown / seconds and ends at nothing; it stays there, and goes on to its front along
 * an ease.
 */
function buildAngles(): number[] {
  const T = FLIP.turn;
  const toBack = T.toBackMs / 1000;
  const toFront = T.toFrontMs / 1000;
  const v = (180 * (T.slowdown + 1)) / T.slowdown / toBack;
  const angles = [0];
  for (let t = STEP_S; t < toBack + STEP_S / 2; t += STEP_S) {
    const u = t / toBack;
    angles.push(v * toBack * (u - u ** (T.slowdown + 1) / (T.slowdown + 1)));
  }
  for (let t = STEP_S; t < T.holdMs / 1000 + STEP_S / 2; t += STEP_S) angles.push(180);
  const ease = gsap.parseEase(T.toFrontEase);
  for (let t = STEP_S; t < toFront + STEP_S / 2; t += STEP_S) angles.push(180 + 180 * ease(t / toFront));
  angles[angles.length - 1] = 360;
  return angles;
}

let angles: number[] | null = null;

export class Flip {
  private turn: gsap.core.Tween | null = null;
  private setX: ((value: number) => void) | null = null;
  private setY: ((value: number) => void) | null = null;
  private x = 0;
  private y = 0;
  private toX = 0;
  private toY = 0;
  private leaning = false;

  constructor(private card: HTMLElement, private surface: HTMLElement | Document) {
    gsap.set(card, { rotationY: 0, rotationX: 0 });
  }

  open() {
    this.stop();
    const table = (angles ??= buildAngles());
    const total = (table.length - 1) * STEP_S;
    const clock = { t: 0 };
    const setY = gsap.quickSetter(this.card, "rotationY", "deg") as (value: number) => void;
    gsap.set(this.card, { rotationY: 0, rotationX: 0 });
    this.turn = gsap.to(clock, {
      t: total,
      duration: total,
      ease: "none",
      onUpdate: () => {
        const at = clock.t / STEP_S;
        const i = Math.min(table.length - 2, Math.floor(at));
        setY(-(table[i] + (table[i + 1] - table[i]) * (at - i)));
      },
      onComplete: () => {
        setY(0);
        this.lean();
      },
    });
  }

  close() {
    this.stop();
    gsap.set(this.card, { rotationY: 0, rotationX: 0 });
  }

  private lean = () => {
    this.turn = null;
    if (!window.matchMedia(FLIP.tilt.media).matches) return;
    this.x = this.y = this.toX = this.toY = 0;
    this.setX = gsap.quickSetter(this.card, "rotationX", "deg") as (value: number) => void;
    this.setY = gsap.quickSetter(this.card, "rotationY", "deg") as (value: number) => void;
    this.surface.addEventListener("pointermove", this.onMove as EventListener);
    gsap.ticker.add(this.follow);
    this.leaning = true;
  };

  /** Where the pointer is from the card's centre, as a share of the way to the window's edge. */
  private onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const b = this.card.getBoundingClientRect();
    const dx = (e.clientX - (b.left + b.width / 2)) / (window.innerWidth / 2);
    const dy = (e.clientY - (b.top + b.height / 2)) / (window.innerHeight / 2);
    const clamp = gsap.utils.clamp(-1, 1);
    this.toY = clamp(dx) * FLIP.tilt.maxDeg;
    this.toX = -clamp(dy) * FLIP.tilt.maxDeg;
  };

  private follow = () => {
    this.x += (this.toX - this.x) * FLIP.tilt.follow;
    this.y += (this.toY - this.y) * FLIP.tilt.follow;
    this.setX?.(this.x);
    this.setY?.(this.y);
  };

  private stop() {
    this.turn?.kill();
    this.turn = null;
    if (!this.leaning) return;
    this.leaning = false;
    this.surface.removeEventListener("pointermove", this.onMove as EventListener);
    gsap.ticker.remove(this.follow);
  }

  dispose() {
    this.stop();
    gsap.set(this.card, { clearProps: "transform" });
  }
}
