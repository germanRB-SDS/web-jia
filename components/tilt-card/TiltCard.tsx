"use client";

import { useReducedMotion } from "@/lib/motion/use-motion";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { TILT } from "./config";
import styles from "./TiltCard.module.css";

type Props = { children: ReactNode; className?: string; /** Extra class on the card itself (the element that turns). */ innerClassName?: string };

/**
 * A card that turns towards the pointer, lifts a little and catches a moving glow — the 3D card of the
 * promoter's reference, as a wrapper: whatever is inside keeps its own markup, styles and controls.
 * Pointer-only: with a coarse pointer, no hover or reduced motion the engine is never started and the
 * children render exactly as before. The glow is decoration (aria-hidden, no pointer).
 */
export function TiltCard({ children, className, innerClassName }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia(TILT.media).matches || reduced) return;
    let tilt: import("./tilt-card").Tilt | null = null;
    let disposed = false;
    import("./tilt-card").then(({ Tilt }) => {
      if (!disposed) tilt = new Tilt(root);
    }).catch(() => { /* Keep the static face if the engine cannot load. */ });
    return () => {
      disposed = true;
      tilt?.dispose();
    };
  }, [reduced]);

  return (
    <div ref={ref} className={`${styles.tilt} ${className ?? ""}`} style={{ "--tilt-perspective": `${TILT.perspectivePx}px` } as CSSProperties}>
      <div className={`${styles.inner} ${innerClassName ?? ""}`}>
        {children}
        <span className={styles.glow} aria-hidden="true" />
      </div>
    </div>
  );
}
