/**
 * Flip card — the one place that tunes the card that turns about its vertical axis when a workshop's sheet opens
 * (JIA-2026-09-19-30, from the promoter's reference "Immersive 3D Tilt Card Modal"). Colours are palette tokens.
 */
export const FLIP = {
  /** The turns on opening (JIA-2026-09-19-31): two whole turns from the front to the front, the same way round, from
      faster to slower without a jolt between them, with a stop on the back in the second one, arriving softly. */
  turns: {
    /** The first turn, and the little extra it slows down by as its back goes by: `depth` is the share of its
        speed it loses right on the back, `spread` how long that lasts, as a share of the turn. */
    firstMs: 1300,
    backDip: { depth: 0.3, spread: 0.13 },
    /** The second, slower turn (2 s of turning, plus the stop). It sets off at the speed the first one ends at and
        slows down all the way to its back, ever more so (`slowdown`: 1 would lose speed evenly; 2 → it sets off
        at 270°/s), where it comes to a stop; it stays there `holdMs`, and sets off again softly to settle on its
        front (`toFrontEase`: in and out). */
    second: { toBackMs: 1000, slowdown: 2, holdMs: 300, toFrontMs: 1000, toFrontEase: "sine.inOut" },
  },
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
