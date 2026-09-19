/**
 * The horseshoe on the footer — the one place that tunes it (JIA-2026-09-19-27, points 8–11).
 * Sizes are CSS pixels of the footer's block above the rule; the model is in metres and is scaled to fit.
 */
export const HORSESHOE = {
  /** Below this width the footer stacks its columns and the shoe moves to the top right corner, smaller. */
  narrowMedia: "(max-width: 759.98px)",
  size: {
    /** Height of the shoe as a share of the block above the rule, then clamped. */
    wide: { share: 0.5, minPx: 96, maxPx: 240 },
    narrow: { share: 0.14, minPx: 64, maxPx: 110 },
  },
  nail: {
    /** Wide: the shoe's right edge sits this far inside the right edge of the brand column ([data-hang-anchor]). */
    wide: { insetRightPx: 8, topPx: 6 },
    /** Narrow: from the block's right edge. */
    narrow: { insetRightPx: 8, topPx: 6 },
    /** The nail, relative to the hanging hole of the model (radius 3.2 mm): shank and head. */
    shankShare: 0.7,
    headShare: 2.1,
  },
  /** How the shoe hangs at rest: turned this much about its nail (degrees, clockwise negative). Point 9. */
  restTiltDeg: 0,
  render: {
    maxPixelRatio: 2,
    light: { sun: 3.4, sky: 1.5 },
  },
} as const;
