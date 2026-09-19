/**
 * Flip card — the one place that tunes the card that turns about its vertical axis when a workshop's sheet opens
 * (JIA-2026-09-19-30, from the promoter's reference "Immersive 3D Tilt Card Modal"). Colours are palette tokens.
 */
export const FLIP = {
  /** The turn on opening: from the back (180°) to the front (0°). */
  turn: { fromDeg: 180, ms: 900, ease: "power3.out" },
  /** Depth of the perspective the card turns in (px), as in the reference. */
  perspectivePx: 3000,
  /** After the turn the card leans towards the pointer: only a fine pointer that can hover gets it. */
  tilt: {
    media: "(hover: hover) and (pointer: fine)",
    /** Most it leans about each axis (degrees), reached with the pointer at the window's edge. */
    maxDeg: 12,
    /** Share of the remaining way to the pointer covered each frame (the reference's interpolation). */
    follow: 0.125,
  },
  /** The back: the ground under the seal (a palette token) and how much of the card's width the seal takes. */
  back: { surface: "var(--jia-ink)", sealShare: 0.88 },
} as const;
