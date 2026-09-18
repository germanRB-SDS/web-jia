"use client";

import { useEffect, useRef, useState } from "react";
import { BulletHole, type Shot } from "@/components/primitives/BulletHole";
import styles from "./SiteFooter.module.css";

/**
 * The cube's bullet hole, on the footer: a click anywhere that is not a link (or another control)
 * leaves a hole at that point. The layer is decoration and never takes the pointer, so the links
 * under a hole keep working. It keeps the last `max` holes.
 */
export function FooterShots({ max }: { max: number }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [shots, setShots] = useState<Shot[]>([]);
  const count = useRef(0);

  useEffect(() => {
    const footer = layerRef.current?.closest("footer");
    if (!footer) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest("a, button, input, select, textarea, summary, [role='button']")) return;
      const box = footer.getBoundingClientRect();
      if (!box.width || !box.height) return;
      const shot: Shot = { key: ++count.current, x: ((e.clientX - box.left) / box.width) * 100, y: ((e.clientY - box.top) / box.height) * 100, turn: Math.round(Math.random() * 360) };
      setShots((all) => [...all, shot].slice(-max));
    };
    footer.addEventListener("click", onClick);
    return () => footer.removeEventListener("click", onClick);
  }, [max]);

  return (
    <div ref={layerRef} className={styles.shots} aria-hidden="true">
      {shots.map((shot) => (
        <BulletHole key={shot.key} shot={shot} />
      ))}
    </div>
  );
}
