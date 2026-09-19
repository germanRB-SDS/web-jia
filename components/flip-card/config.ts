/**
 * Flip card — the one place that tunes the card that turns about its vertical axis when a workshop's sheet opens
 * (JIA-2026-09-19-30, from the promoter's reference "Immersive 3D Tilt Card Modal"). Colours are palette tokens.
 */
export const FLIP = {
  /** The turn on opening: from the back (180°) to the front (0°), fast at first and slower as it arrives. */
  turn: { fromDeg: 180, ms: 900, ease: "power3.out" },
  /** Then a second, whole turn the same way, 1.2 s in all (promoter, JIA-2026-09-19-30): to the back, where it
      stops for `holdMs`, and on to the front, again from faster to slower. `null` leaves the first turn alone. */
  again: { toBackMs: 500, toBackEase: "power2.inOut", holdMs: 100, toFrontMs: 700, toFrontEase: "power3.out" } as {
    toBackMs: number; toBackEase: string; holdMs: number; toFrontMs: number; toFrontEase: string;
  } | null,
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
