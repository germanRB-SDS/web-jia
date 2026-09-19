/**
 * Flip card — the one place that tunes the card that turns about its vertical axis when a workshop's sheet opens
 * (JIA-2026-09-19-30, from the promoter's reference "Immersive 3D Tilt Card Modal"). Colours are palette tokens.
 */
export const FLIP = {
  /** The turn on opening (JIA-2026-09-19-31, promoter's last word): one slow turn from the front to the front. It
      sets off at speed and slows down all the way to its back, ever more so (`slowdown`: 1 would lose speed evenly;
      2 → it sets off at 270°/s), where it comes to a stop; it stays there `holdMs`, with the seal in view, and sets
      off again softly to settle on its front (`toFrontEase`: in and out). */
  turn: { toBackMs: 1000, slowdown: 2, holdMs: 400, toFrontMs: 1000, toFrontEase: "sine.inOut" },
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
