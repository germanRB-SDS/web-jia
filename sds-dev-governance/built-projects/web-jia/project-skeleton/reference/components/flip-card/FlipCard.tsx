"use client";

import { useReducedMotion } from "@/lib/motion/use-motion";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { FLIP } from "./config";
import styles from "./FlipCard.module.css";

type Props = {
  /** The face the card ends on; it gives the card its size. */
  front: ReactNode;
  /** The face seen as it turns (decoration: hidden from assistive technology). */
  back: ReactNode;
  /** Each time this turns true the card turns once, from its front to its front; when it turns false it stops. */
  open: boolean;
  className?: string;
};

/**
 * A card with two faces that turns once about its vertical axis when `open` becomes true and ends exactly where its
 * front would be without it (the front is in the flow; the back lies behind it). After the turn it leans softly towards a
 * fine pointer. With reduced motion the engine is never started: the front stands still. Engine: flip-card.ts.
 */
export function FlipCard({ front, back, open, className }: Props) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<import("./flip-card").Flip | null>(null);
  const openRef = useRef(open);

  useEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;
    if (reduced) return;
    let disposed = false;
    import("./flip-card").then(({ Flip }) => {
      if (disposed) return;
      flipRef.current = new Flip(card, root.closest("dialog") ?? document);
      if (openRef.current) flipRef.current.open();
    }).catch(() => { /* Keep the static face if the engine cannot load. */ });
    return () => {
      disposed = true;
      flipRef.current?.dispose();
      flipRef.current = null;
    };
  }, [reduced]);

  // Before the paint, so the turn starts with the dialog's first frame.
  useLayoutEffect(() => {
    openRef.current = open;
    if (open) flipRef.current?.open();
    else flipRef.current?.close();
  }, [open]);

  const style = { "--flip-perspective": `${FLIP.perspectivePx}px`, "--flip-back": FLIP.back.surface, "--flip-seal-share": String(FLIP.back.sealShare) } as CSSProperties;
  return (
    <div ref={rootRef} className={`${styles.flip} ${className ?? ""}`} style={style}>
      <div ref={cardRef} className={styles.card}>
        <div className={styles.front}>{front}</div>
        <div className={styles.back} aria-hidden="true">
          {back}
        </div>
      </div>
    </div>
  );
}
