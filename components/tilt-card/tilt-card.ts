/**
 * The tilt engine: plain DOM, no React. On `pointerenter` it takes the card's box; on every `pointermove`
 * it sets the rotation axis, the angle, the scale and the glow's centre as CSS custom properties on the
 * root (TiltCard.module.css turns them into the transform and the radial gradient, with its own
 * transitions); on `pointerleave` it clears them. Nothing is listened to on `document`.
 */
import { TILT } from "./config";

export class Tilt {
  private bounds: DOMRect | null = null;
  private frame = 0;
  private last: PointerEvent | null = null;

  constructor(private root: HTMLElement) {
    root.addEventListener("pointerenter", this.onEnter);
    root.addEventListener("pointermove", this.onMove);
    root.addEventListener("pointerleave", this.onLeave);
  }

  private onEnter = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    this.bounds = this.root.getBoundingClientRect();
    this.root.setAttribute("data-active", "");
  };

  private onMove = (e: PointerEvent) => {
    if (!this.bounds) return;
    this.last = e;
    if (!this.frame) this.frame = requestAnimationFrame(this.apply);
  };

  private apply = () => {
    this.frame = 0;
    const e = this.last;
    const b = this.bounds;
    if (!e || !b) return;
    const cx = e.clientX - b.left - b.width / 2;
    const cy = e.clientY - b.top - b.height / 2;
    const distance = Math.hypot(cx, cy);
    const angle = Math.min(TILT.maxAngleDeg, Math.log(Math.max(1, distance)) * TILT.angleFactor);
    const s = this.root.style;
    s.setProperty("--tilt-ax", (cy / TILT.axisDivisor).toFixed(3));
    s.setProperty("--tilt-ay", (-cx / TILT.axisDivisor).toFixed(3));
    s.setProperty("--tilt-deg", `${angle.toFixed(2)}deg`);
    s.setProperty("--tilt-scale", String(TILT.scale));
    s.setProperty("--tilt-x", `${(cx * TILT.glowTravel + b.width / 2).toFixed(1)}px`);
    s.setProperty("--tilt-y", `${(cy * TILT.glowTravel + b.height / 2).toFixed(1)}px`);
  };

  private onLeave = () => {
    this.bounds = null;
    this.last = null;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.root.removeAttribute("data-active");
    for (const name of ["--tilt-ax", "--tilt-ay", "--tilt-deg", "--tilt-scale", "--tilt-x", "--tilt-y"]) this.root.style.removeProperty(name);
  };

  dispose() {
    this.onLeave();
    this.root.removeEventListener("pointerenter", this.onEnter);
    this.root.removeEventListener("pointermove", this.onMove);
    this.root.removeEventListener("pointerleave", this.onLeave);
  }
}
