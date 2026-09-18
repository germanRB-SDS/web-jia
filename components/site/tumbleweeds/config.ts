/** Tumbleweeds in the footer's credit strip (JIA-2026-09-18-20) — the one place that tunes them. */
export const TUMBLEWEEDS = {
  /** Seconds between births while the pointer stays on the credit. */
  wait: [2, 5],
  /** Size as a share of the studio mark's height: at the front of the field and at its back. */
  size: { front: 0.8, back: 0.15 },
  /** A weed measures between this share and the whole of the size its depth allows. */
  sizeJitter: 0.75,
  minSize: 4,
  /** The base of a weed never stands above this share of the strip's height (from the bottom). */
  maxBase: 0.7,
  /** Pixels per second, at the front and at the back. */
  speed: { front: 150, back: 48 },
  /** The run's time scale swings between these. */
  gust: [0.75, 1.35],
  /** Seconds between hops, and their height as a share of the weed's size. */
  hopEvery: [0.9, 2.6],
  hop: [0.25, 0.7],
  backOpacity: 0.5,
  branches: [12, 18],
  maxAlive: 8,
} as const;
