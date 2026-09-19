/**
 * The horseshoe on the footer — the one place that tunes it (JIA-2026-09-19-27, points 8–11).
 * Sizes are CSS pixels of the footer's block above the rule; the model is in metres and is scaled to fit.
 */
export const HORSESHOE = {
  /** Only large desktop windows get the shoe (promoter): below this it is not even mounted. From 1600 px the
      window's margin beside the container holds it without covering the "Colabora" column. */
  largeMedia: "(min-width: 1600px)",
  /** Height of the shoe as a share of the block above the rule, then clamped. */
  size: { share: 0.5, minPx: 96, maxPx: 240 },
  nail: {
    /** The shoe's right edge sits this far inside the window's right edge; the nail this far below the footer's top. */
    insetRightPx: 28,
    topPx: 6,
    /** The nail, relative to the hanging hole of the model (radius 3.2 mm): shank and head. */
    shankShare: 0.7,
    headShare: 2.1,
  },
  /** How the shoe hangs at rest: turned this much about its nail (degrees, clockwise negative). Point 9. */
  restTiltDeg: -14,
  render: {
    maxPixelRatio: 2,
    light: { sun: 3.4, sky: 1.5 },
  },
} as const;
