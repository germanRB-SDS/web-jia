/**
 * The flip engine: plain DOM, no React. `open()` turns the card twice about its vertical axis, from its front to its
 * front, from faster to slower (a little slower still as its back goes by in the first turn); once there, with a fine
 * pointer, the card leans softly towards the pointer (quick setters fed from GSAP's ticker, easing a share of the way
 * each frame). `close()` stops everything and leaves the card on its front without animating, ready for the next
 * opening. The pointer is listened to on the surface given (the dialog), only between the end of the turns and `close()`.
 */
import gsap from "gsap";
import { FLIP } from "./config";

const STEP_S = 0.005;

/**
 * The angle turned (degrees, 0 → 720) every STEP_S seconds. Speeds in degrees per second. The second turn's speed is
 * V·(1 − u^hold), which starts at V = 360·(hold + 1) / hold / seconds and ends at nothing. The first turn's speed
 * falls in a straight line to that V, less the dip around the moment its back faces the eye; where it starts from
 * is whatever makes the turn exactly 360° (found by bisection, the dip's moment by iteration).
 */
function buildAngles(): number[] {
  const T = FLIP.turns;
  const t1 = T.firstMs / 1000;
  const t2 = T.secondMs / 1000;
  const v2 = (360 * (T.secondHold + 1)) / T.secondHold / t2;
  const first = (v0: number, dipAt: number) => {
    const out = [0];
    for (let t = STEP_S; t < t1 + STEP_S / 2; t += STEP_S) {
      const u = (t - STEP_S / 2) / t1;
      const dip = 1 - T.backDip.depth * Math.exp(-(((u - dipAt) / T.backDip.spread) ** 2));
      out.push(out[out.length - 1] + (v0 + (v2 - v0) * u) * dip * STEP_S);
    }
    return out;
  };
  let dipAt = 0.5;
  let turn = first(v2, dipAt);
  for (let pass = 0; pass < 4; pass++) {
    let lo = v2;
    let hi = v2 * 4;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      turn = first(mid, dipAt);
      if (turn[turn.length - 1] < 360) lo = mid;
      else hi = mid;
    }
    dipAt = turn.findIndex((a) => a >= 180) / (turn.length - 1);
  }
  const angles = turn.map((a) => (a * 360) / turn[turn.length - 1]);
  for (let t = STEP_S; t < t2 + STEP_S / 2; t += STEP_S) {
    const u = t / t2;
    angles.push(360 + v2 * t2 * (u - u ** (T.secondHold + 1) / (T.secondHold + 1)));
  }
  angles[angles.length - 1] = 720;
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
