import type { CSSProperties } from "react";
import styles from "./BulletHole.module.css";

/** Where a shot landed, in percent of the surface that took it, and how the hole is turned so no two look alike. */
export type Shot = { key: number; x: number; y: number; turn: number };

/** A bullet hole on its host surface (which must be positioned). Decoration: it never takes the pointer. */
export function BulletHole({ shot }: { shot: Shot }) {
  return <span className={styles.hole} aria-hidden="true" style={{ left: `${shot.x}%`, top: `${shot.y}%`, "--hole-turn": `${shot.turn}deg` } as CSSProperties} />;
}
