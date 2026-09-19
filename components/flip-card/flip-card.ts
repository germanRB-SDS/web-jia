/**
 * The flip engine: plain DOM, no React. `open()` puts the card on its back and turns it about its vertical axis to
 * its front (GSAP); once there, with a fine pointer, the card leans softly towards the pointer (quick setters fed
 * from GSAP's ticker, easing a share of the way each frame). `close()` stops everything and leaves the card on its
 * back without animating, ready for the next opening. The pointer is listened to on the surface given (the dialog),
 * only between the end of the turn and `close()`.
 */
import gsap from "gsap";
import { FLIP } from "./config";

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
    gsap.set(card, { rotationY: FLIP.turn.fromDeg, rotationX: 0 });
  }

  open() {
    this.stop();
    this.turn = gsap.fromTo(
      this.card,
      { rotationY: FLIP.turn.fromDeg, rotationX: 0 },
      { rotationY: 0, duration: FLIP.turn.ms / 1000, ease: FLIP.turn.ease, onComplete: this.lean },
    );
  }

  close() {
    this.stop();
    gsap.set(this.card, { rotationY: FLIP.turn.fromDeg, rotationX: 0 });
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
