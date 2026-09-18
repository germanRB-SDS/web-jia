"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { BulletHole, type Shot } from "@/components/primitives/BulletHole";
import styles from "./SiteFooter.module.css";

type Props = {
  max: number;
  /** Milliseconds a hole stays before it starts to fade, and how long the fade takes. */
  lifeMs: number;
  fadeMs: number;
};

/**
 * The cube's bullet hole, on the footer: a click anywhere that is not a link (or another control)
 * leaves a hole at that point. Each hole has its own life: it starts to fade `lifeMs` after the shot
 * and is removed once faded (at once under reduced motion). The layer is decoration and never takes
 * the pointer, so the links under a hole keep working. It never holds more than `max` holes.
 */
export function FooterShots({ max, lifeMs, fadeMs }: Props) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [shots, setShots] = useState<(Shot & { leaving: boolean })[]>([]);
  const count = useRef(0);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const footer = layerRef.current?.closest("footer");
    if (!footer) return;
    const pending = timers.current;
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        pending.delete(id);
        fn();
      }, ms);
      pending.add(id);
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest("a, button, input, select, textarea, summary, [role='button']")) return;
      const box = footer.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const key = ++count.current;
      const shot = { key, x: ((e.clientX - box.left) / box.width) * 100, y: ((e.clientY - box.top) / box.height) * 100, turn: Math.round(Math.random() * 360), leaving: false };
      setShots((all) => [...all, shot].slice(-max));
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      later(() => setShots((all) => all.map((s) => (s.key === key ? { ...s, leaving: true } : s))), lifeMs);
      later(() => setShots((all) => all.filter((s) => s.key !== key)), lifeMs + (calm ? 0 : fadeMs));
    };
    footer.addEventListener("click", onClick);
    return () => {
      footer.removeEventListener("click", onClick);
      pending.forEach((id) => window.clearTimeout(id));
      pending.clear();
    };
  }, [max, lifeMs, fadeMs]);

  return (
    <div ref={layerRef} className={styles.shots} aria-hidden="true" style={{ "--hole-fade": `${fadeMs}ms` } as CSSProperties}>
      {shots.map(({ leaving, ...shot }) => (
        <BulletHole key={shot.key} shot={shot} leaving={leaving} />
      ))}
    </div>
  );
}
