"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Shot } from "@/components/primitives/BulletHole";
import { isMotionReduced } from "@/lib/motion/policy";
import { FILM_REEL } from "./config";

const TUNE = FILM_REEL.volley;

/** Which frame took the volley (the strip repeats its set, so the copy matters too) and the holes in it. */
export type Volley = { copy: number; index: number; shots: Shot[]; leaving: boolean };

/** A point of the frame's window that is not the download control itself (its corner, bottom right). */
function aim(key: number): Shot {
  for (;;) {
    const x = TUNE.area.x[0] + Math.random() * (TUNE.area.x[1] - TUNE.area.x[0]);
    const y = TUNE.area.y[0] + Math.random() * (TUNE.area.y[1] - TUNE.area.y[0]);
    if (x > TUNE.spare.x && y > TUNE.spare.y) continue;
    return { key, x, y, turn: Math.round(Math.random() * 360) };
  }
}

/**
 * Three shots into a frame when a real mouse rests on its download control ([65-0] hotfix 2): two in a row, the third a
 * moment later. They go 3 s after the last one, or at once when the mouse moves on or the control is clicked. Only a
 * hovering, fine pointer counts (never touch), and never under reduced motion.
 */
export function useFrameVolley() {
  const [volley, setVolley] = useState<Volley | null>(null);
  const timers = useRef(new Set<number>());
  const rest = useRef<{ x: number; y: number } | null>(null);
  const count = useRef(0);
  /** One volley per visit: after it, the control waits for the mouse to leave before it can fire again. */
  const spent = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.clear();
  };
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  };

  /** The holes fade out (at once under reduced motion) and are removed. */
  const stop = useCallback(() => {
    clearTimers();
    rest.current = null;
    setVolley((v) => (v && !v.leaving ? { ...v, leaving: true } : v));
    later(() => setVolley(null), isMotionReduced() ? 0 : TUNE.fade);
  }, []);

  const fire = (copy: number, index: number) => {
    spent.current = true;
    setVolley({ copy, index, shots: [], leaving: false });
    TUNE.gaps.forEach((at, n) => {
      later(() => {
        const shot = aim(++count.current);
        setVolley((v) => (v && v.copy === copy && v.index === index ? { ...v, shots: [...v.shots, shot] } : v));
        if (n === TUNE.gaps.length - 1) later(stop, TUNE.life);
      }, at);
    });
  };

  /** Pointer handlers for one frame's control. The volley waits for the mouse to rest there (`dwell`), then fires. */
  const handlers = (copy: number, index: number) => ({
    onPointerMove: (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || isMotionReduced() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      const at = rest.current;
      if (at && Math.hypot(e.clientX - at.x, e.clientY - at.y) <= TUNE.tolerance) return;
      if (at || spent.current) {
        // It had rested and moved on: the holes go (and this visit has had its volley).
        if (at) stop();
        return;
      }
      // Still settling: the dwell starts over from here.
      clearTimers();
      later(() => {
        rest.current = { x: e.clientX, y: e.clientY };
        fire(copy, index);
      }, TUNE.dwell);
    },
    onPointerLeave: () => {
      spent.current = false;
      if (rest.current || timers.current.size) stop();
    },
    onClick: () => {
      spent.current = true;
      stop();
    },
  });

  useEffect(() => clearTimers, []);

  return { volley, handlers };
}
