"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { HORSESHOE_PATH } from "@/components/icons";
import { useReducedMotion } from "@/lib/motion/use-motion";
import { WAGON_TRAIL as T } from "./config";
import styles from "./WagonTrail.module.css";

type Pt = { x: number; y: number };
type Print = { x: number; y: number; turn: number; at: number };

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

/** The trail for a layer of this size: the centre line (for the reveal), the two ruts and every horseshoe print. */
function build(width: number, height: number) {
  const line = sample(T.route.map(([fx, fy]) => ({ x: fx * width, y: fy * height })));
  // Arc length and the unit normal at each sample.
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

  // Hoofprints: two horses, each foot alternately left and right of its line, one print per stride.
  const rand = seeded(68);
  const prints: Print[] = [];
  let i = 0;
  for (let s = T.stride / 2, step = 0; s < length; s += T.stride, step++) {
    while (i < along.length - 1 && along[i] < s) i++;
    const p = line[i];
    const d = dir[i];
    const heading = (Math.atan2(d.y, d.x) * 180) / Math.PI;
    for (const horse of [-1, 1]) {
      const side = (step + (horse > 0 ? 1 : 0)) % 2 ? 1 : -1;
      const off = horse * T.gauge * T.horses + side * T.hoofSpread + (rand() - 0.5) * 2 * T.jitter.offset;
      const forward = (rand() - 0.5) * T.stride * 0.3;
      prints.push({
        x: p.x - d.y * off + d.x * forward,
        y: p.y + d.x * off + d.y * forward,
        // The shoe's toe is drawn pointing down (+y); turn it to the heading.
        turn: heading - 90 + (rand() - 0.5) * 2 * T.jitter.turn,
        at: s / length,
      });
    }
  }
  return { centre: toPath(line), ruts: [toPath(offset(-T.gauge)), toPath(offset(T.gauge))], prints };
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
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [passed, setPassed] = useState(false);
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
    if (!el || passed) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPassed(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [passed]);

  const trail = useMemo(() => (size ? build(size.w, size.h) : null), [size]);
  const shoeScale = T.shoe / 116.9;

  return (
    <div
      ref={host}
      className={styles.trail}
      aria-hidden="true"
      data-state={reduced ? "still" : passed ? "passing" : "waiting"}
      style={{ "--trail-pass": `${T.pass}s`, "--trail-opacity": String(T.opacity), "--trail-rut": `${T.rut}px`, "--trail-gauge": `${T.gauge * 2 + T.rut * 2}px` } as CSSProperties}
    >
      {trail && size ? (
        <svg width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`} focusable="false">
          <defs>
            <path id="wagon-trail-shoe" d={HORSESHOE_PATH} transform={`scale(${shoeScale}) translate(-58.45 -61.44)`} fillRule="evenodd" />
            {/* The reveal: a wide stroke along the centre line, drawn as the wagon advances. */}
            <mask id="wagon-trail-reveal" maskUnits="userSpaceOnUse" x="0" y="0" width={size.w} height={size.h}>
              <path className={styles.reveal} d={trail.centre} pathLength={1} />
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
                transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.turn.toFixed(1)})`}
                style={{ "--at": p.at.toFixed(4) } as CSSProperties}
              />
            ))}
          </g>
        </svg>
      ) : null}
    </div>
  );
}
