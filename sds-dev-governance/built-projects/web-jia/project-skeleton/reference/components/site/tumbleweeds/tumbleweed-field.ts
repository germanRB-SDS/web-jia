/**
 * Tumbleweeds (estepicursores) rolling across a strip, left to right — GSAP, no React here.
 *
 * While `start()` is in force one is born at once and the next after a random wait; `stop()` ends
 * the births and lets the ones on stage roll out. Each is born at a random depth: further back
 * means higher in the strip, smaller, slower and fainter, like a field seen from its edge. They
 * turn exactly as much as they advance (angle = distance / radius) and now and then hop, as if
 * over a pebble. The field only adds and removes its own elements inside `stage`.
 */
import gsap from "gsap";
import { TUMBLEWEEDS as CFG } from "./config";

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const SVG_NS = "http://www.w3.org/2000/svg";

/** A tangle of branches inside a circle; no two alike. Colours are the palette's, set by the stylesheet. */
function drawWeed(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "-50 -50 100 100");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke-linecap", "round");
  const point = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  const path = (d: string, tone: number, width: number) => {
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("data-tone", String(tone));
    p.setAttribute("stroke-width", width.toFixed(1));
    svg.append(p);
  };
  // The rim: two wobbly rings, so the silhouette reads as a ball and never as a perfect circle.
  for (let ring = 0; ring < 2; ring++) {
    const steps = 9;
    const radii = Array.from({ length: steps }, () => rand(36, 47) - ring * 9);
    const at = (i: number) => point(radii[i % steps], (i / steps) * Math.PI * 2);
    let d = `M${at(0)}`;
    for (let i = 1; i <= steps; i++) d += ` Q${point(radii[i % steps] + rand(2, 7), ((i - 0.5) / steps) * Math.PI * 2)} ${at(i)}`;
    path(d, ring, 3.2 - ring);
  }
  // The tangle: branches from rim to rim, bowed through the middle.
  const branches = Math.round(rand(CFG.branches[0], CFG.branches[1]));
  for (let i = 0; i < branches; i++) {
    const a = rand(0, Math.PI * 2);
    const b = a + rand(Math.PI * 0.45, Math.PI * 1.3);
    path(`M${point(rand(34, 45), a)} Q${point(rand(0, 26), rand(0, Math.PI * 2))} ${point(rand(34, 45), b)}`, i % 3, rand(1.6, 3));
  }
  return svg;
}

export class TumbleweedField {
  private alive = new Set<gsap.core.Timeline>();
  private next: gsap.core.Tween | null = null;
  private running = false;

  constructor(
    private stage: HTMLElement,
    /** The studio's mark: every size is a share of its height. */
    private mark: HTMLElement,
  ) {}

  /** The pointer is on the credit: one now, then one after each random wait. */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.spawn();
    this.schedule();
  }

  /** No more births; the ones rolling finish their way out. */
  stop(): void {
    this.running = false;
    this.next?.kill();
    this.next = null;
  }

  private schedule(): void {
    this.next = gsap.delayedCall(rand(CFG.wait[0], CFG.wait[1]), () => {
      if (!this.running) return;
      this.spawn();
      this.schedule();
    });
  }

  private spawn(): void {
    if (this.alive.size >= CFG.maxAlive) return;
    const width = this.stage.clientWidth;
    const height = this.stage.clientHeight;
    const markHeight = this.mark.offsetHeight || 32;
    if (!width || !height) return;

    // 0 is the front of the field, 1 the back.
    const depth = Math.random();
    const size = Math.max(CFG.minSize, markHeight * lerp(CFG.size.front, CFG.size.back, depth) * rand(CFG.sizeJitter, 1));
    const base = Math.min(height * CFG.maxBase * depth, Math.max(0, height - size));
    const speed = lerp(CFG.speed.front, CFG.speed.back, depth) * rand(0.8, 1.25);
    const distance = width + size * 2;
    const duration = distance / speed;

    const weed = document.createElement("span");
    weed.className = "weed";
    weed.style.cssText = `width:${size.toFixed(1)}px;height:${size.toFixed(1)}px;bottom:${base.toFixed(1)}px;opacity:${lerp(1, CFG.backOpacity, depth).toFixed(2)};z-index:${Math.round((1 - depth) * 100)}`;
    weed.dataset.depth = depth.toFixed(2);
    const hopper = document.createElement("span");
    const roller = document.createElement("span");
    roller.append(drawWeed());
    hopper.append(roller);
    weed.append(hopper);
    this.stage.append(weed);

    const tl = gsap.timeline({
      onComplete: () => {
        weed.remove();
        gust.kill();
        this.alive.delete(tl);
      },
    });
    gsap.set(weed, { x: -size });
    tl.to(weed, { x: width + size, duration, ease: "none" }, 0);
    // Rolling without slipping: the angle is the distance over the radius.
    tl.to(roller, { rotation: (distance / (size / 2)) * (180 / Math.PI), duration, ease: "none" }, 0);
    // Pebbles: a hop, the fall and one short rebound.
    for (let t = rand(0.3, CFG.hopEvery[1]); t < duration - 0.8; t += rand(CFG.hopEvery[0], CFG.hopEvery[1])) {
      const lift = size * rand(CFG.hop[0], CFG.hop[1]);
      const up = rand(0.16, 0.26);
      tl.to(hopper, { y: -lift, duration: up, ease: "power2.out" }, t)
        .to(hopper, { y: 0, duration: up, ease: "power2.in" }, t + up)
        .to(hopper, { y: -lift * 0.28, duration: up * 0.55, ease: "power1.out" }, t + up * 2)
        .to(hopper, { y: 0, duration: up * 0.55, ease: "power1.in" }, t + up * 2.55);
    }
    // Gusts: the whole run speeds up and eases off, so the speed is never even.
    const gust = gsap.to(tl, { timeScale: rand(CFG.gust[0], CFG.gust[1]), duration: rand(0.9, 1.8), ease: "sine.inOut", repeat: -1, yoyo: true });
    this.alive.add(tl);
  }

  dispose(): void {
    this.stop();
    for (const tl of this.alive) {
      gsap.killTweensOf(tl); // The repeating gust owns the timeline as its target.
      tl.kill();
    }
    this.alive.clear();
    this.stage.replaceChildren();
  }
}
