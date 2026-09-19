"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { TILT } from "./config";
import styles from "./TiltCard.module.css";

type Props = { children: ReactNode; className?: string };

/**
 * A card that turns towards the pointer, lifts a little and catches a moving glow — the 3D card of the
 * promoter's reference, as a wrapper: whatever is inside keeps its own markup, styles and controls.
 * Pointer-only: with a coarse pointer, no hover or reduced motion the engine is never started and the
 * children render exactly as before. The glow is decoration (aria-hidden, no pointer).
 */
export function TiltCard({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!window.matchMedia(TILT.media).matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tilt: import("./tilt-card").Tilt | null = null;
    let disposed = false;
    import("./tilt-card").then(({ Tilt }) => {
      if (!disposed) tilt = new Tilt(root);
    });
    return () => {
      disposed = true;
      tilt?.dispose();
    };
  }, []);

  return (
    <div ref={ref} className={`${styles.tilt} ${className ?? ""}`} style={{ "--tilt-perspective": `${TILT.perspectivePx}px` } as CSSProperties}>
      <div className={styles.inner}>
        {children}
        <span className={styles.glow} aria-hidden="true" />
      </div>
    </div>
  );
}
