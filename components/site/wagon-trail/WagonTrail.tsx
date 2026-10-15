"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { HORSESHOE_PATH } from "@/components/icons";
import { useReducedMotion } from "@/lib/motion/use-motion";
import { WAGON_TRAIL as T } from "./config";
import styles from "./WagonTrail.module.css";

type Pt = { x: number; y: number };
type Print = { x: number; y: number; turn: number; at: number; scale: number };

/** A small seeded random, so a trail redrawn after a resize keeps its walk. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Catmull-Rom through the route, sampled every few pixels. */
function sample(points: Pt[], step = 4): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(p2.x - p1.x, p2.y - p1.y) / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

/** The trail for a layer of this size: the centre line (for the reveal), the two ruts, every horseshoe print with
    the moment the wagon reaches it, and the reveal's keyframes on that same clock. */
function build(width: number, height: number) {
  const line = sample(T.route.map(([fx, fy]) => ({ x: fx * width, y: fy * height })));
  const along: number[] = [0];
  for (let i = 1; i < line.length; i++) along.push(along[i - 1] + Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y));
  const length = along[along.length - 1];
  const dir = line.map((_, i) => {
    const a = line[Math.max(0, i - 1)];
    const b = line[Math.min(line.length - 1, i + 1)];
    const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return { x: (b.x - a.x) / d, y: (b.y - a.y) / d };
  });
  const offset = (d: number) => line.map((p, i) => ({ x: p.x - dir[i].y * d, y: p.y + dir[i].x * d }));
  const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");

  // Where it halts: the first time the road reaches the middle of the screen.
  const haltIndex = Math.max(1, line.findIndex((p) => p.x >= width * T.halt.at));
  const halt = along[haltIndex];
  const smooth = (t: number) => t * t * (3 - 2 * t);

  /* The clock: a walk that breathes (its pace swings a little), the halt, then the horse gathers itself into the
     gallop over `ramp` pixels and keeps a livelier but steadier pace. `time[i]` is when the wagon is at sample i. */
  const speed = (s: number) => {
    if (s < halt) return T.walk.speed * (1 + T.walk.wobble * Math.sin(s / 70) * Math.sin(s / 173 + 1.3));
    const k = smooth(Math.min(1, (s - halt) / T.halt.ramp));
    const base = T.walk.speed * 0.55 + (T.gallop.speed - T.walk.speed * 0.55) * k;
    return base * (1 + T.gallop.wobble * Math.sin(s / 55));
  };
  const time: number[] = [0];
  for (let i = 1; i < line.length; i++) {
    const ds = along[i] - along[i - 1];
    time.push(time[i - 1] + ds / speed((along[i] + along[i - 1]) / 2) + (i === haltIndex ? T.halt.pause : 0));
  }
  // The horse's clock ends at `horseEnd`; the wheels, `wheelLag` behind it, need a little more to leave the road.
  const horseEnd = time[time.length - 1];
  const total = horseEnd + T.wheelLag / T.gallop.speed;
  const at = (s: number) => {
    let i = 1;
    while (i < along.length - 1 && along[i] < s) i++;
    const f = (s - along[i - 1]) / ((along[i] - along[i - 1]) || 1);
    return { i, t: time[i - 1] + (time[i] - time[i - 1] - (i === haltIndex ? T.halt.pause : 0)) * f };
  };

  // The prints: one horse on the centre line; walking before the halt, galloping after it.
  const rand = seeded(68);
  const prints: Print[] = [];
  const stamp = (s: number, side: number, spread: number, turnJitter: number, scale: number) => {
    if (s <= 0 || s >= length) return;
    const { i, t } = at(s);
    const p = line[i];
    const d = dir[i];
    const off = side * spread + (rand() - 0.5) * 2 * T.jitter.offset;
    const heading = (Math.atan2(d.y, d.x) * 180) / Math.PI;
    // The shoe's toe is drawn pointing down (+y); turn it to the heading.
    prints.push({ x: p.x - d.y * off, y: p.y + d.x * off, turn: heading - 90 + (rand() - 0.5) * 2 * turnJitter, at: t, scale });
  };
  let step = 0;
  for (let s = T.walk.stride / 2; s < halt; s += T.walk.stride * (0.92 + rand() * 0.16), step++) {
    stamp(s, step % 2 ? 1 : -1, T.walk.spread, T.jitter.turn, 1);
  }
  // Gathering into the gallop: the first groups come shorter, then the leap opens to the full stride.
  for (let s = halt + T.walk.stride, n = 0; s < length; n++) {
    const reach = 0.55 + 0.45 * smooth(Math.min(1, n / 3));
    for (const [d, side] of T.gallop.beats) stamp(s + d * reach, side, T.gallop.spread, T.gallop.turn, T.gallop.scale);
    s += T.gallop.stride * reach * (0.94 + rand() * 0.12);
  }

  /* The reveal on the same clock, for the WHEELS: when the horse is at `along[i]` they are `wheelLag` behind it, so
     the ruts follow the prints and never lead them. Dash offset 1 (nothing) to 0 (the whole road). Every few
     samples, plus the two around the halt: between them the road barely moves for the whole pause. */
  const every = Math.max(1, Math.floor(line.length / 160));
  const keys = new Set<number>([0, haltIndex - 1, haltIndex, line.length - 1]);
  for (let i = 0; i < line.length; i += every) keys.add(i);
  const keyframes = [...keys]
    .sort((p, q) => p - q)
    .map((i) => ({ offset: time[i] / total, strokeDashoffset: 1 - Math.max(0, along[i] - T.wheelLag) / length }));
  keyframes.push({ offset: 1, strokeDashoffset: 0 });

  return { centre: toPath(line), ruts: [toPath(offset(-T.gauge)), toPath(offset(T.gauge))], prints, keyframes, total };
}

/**
 * The wagon trail behind «Programa» ([68-0]): two wheel ruts and, between them, the prints of the two horses that
 * pulled it, along a winding road that runs under the two days. Decoration only (aria-hidden, no pointer), from
 * 760 px (the stylesheet hides it below). It is drawn for the layer's real size and redrawn when that changes. The
 * first time it comes into view the wagon goes by once and leaves the road behind it; with reduced motion the road
 * is simply there.
 */
export function WagonTrail() {
  const host = useRef<HTMLDivElement>(null);
  const reveal = useRef<SVGPathElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [state, setState] = useState<"waiting" | "passing" | "done">("waiting");
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.round(el.clientWidth);
      const h = Math.round(el.clientHeight);
      setSize((s) => (w && h && (!s || s.w !== w || s.h !== h) ? { w, h } : s));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el || state !== "waiting") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("passing");
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [state]);

  const trail = useMemo(() => (size ? build(size.w, size.h) : null), [size]);

  /* The pass, once: the ruts are unveiled on the wagon's own clock (walk, halt, gallop). If the trail is redrawn
     mid-pass (the window resized) the pass starts again on the new road; the prints follow it on the same clock. */
  useEffect(() => {
    const path = reveal.current;
    if (!trail || !path || state !== "passing" || reduced) return;
    const run = path.animate(trail.keyframes, { duration: trail.total * 1000, easing: "linear", fill: "forwards" });
    run.onfinish = () => setState("done");
    return () => run.cancel();
  }, [trail, state, reduced]);

  const shoeScale = T.shoe / 116.9;

  return (
    <div
      ref={host}
      className={styles.trail}
      aria-hidden="true"
      data-state={reduced ? "still" : state}
      style={{ "--trail-opacity": String(T.opacity), "--trail-ruts": String(T.rutOpacity / T.opacity), "--trail-rut": `${T.rut}px`, "--trail-gauge": `${T.gauge * 2 + T.rut * 2}px` } as CSSProperties}
    >
      {trail && size ? (
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} focusable="false">
          <defs>
            <path id="wagon-trail-shoe" d={HORSESHOE_PATH} transform={`scale(${shoeScale}) translate(-58.45 -61.44)`} fillRule="evenodd" />
            {/* The reveal: a wide stroke along the centre line, drawn as the wagon advances. */}
            <mask id="wagon-trail-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
              <path ref={reveal} className={styles.reveal} d={trail.centre} pathLength={1} />
            </mask>
          </defs>
          <g className={styles.ruts} mask="url(#wagon-trail-reveal)">
            {trail.ruts.map((d) => (
              <g key={d}>
                <path className={styles.rutBed} d={d} />
                <path className={styles.rutTread} d={d} />
              </g>
            ))}
          </g>
          <g className={styles.prints}>
            {trail.prints.map((p, n) => (
              <use
                key={n}
                href="#wagon-trail-shoe"
                transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.turn.toFixed(1)}) scale(${p.scale})`}
                style={{ "--delay": `${p.at.toFixed(3)}s` } as CSSProperties}
              />
            ))}
          </g>
        </svg>
      ) : null}
    </div>
  );
}
