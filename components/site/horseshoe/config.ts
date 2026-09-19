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
  /** Point 10: a click and the nail gives. Times in ms; angles in degrees about the nail hole. */
  fall: {
    /** The wobble before it lets go. */
    swingMs: 420,
    swingDeg: 9,
    /** The drop to the rule (the floor), and how it turns on the way down. */
    fallMs: 720,
    spinDeg: -82,
    /** Two bounces, as a share of the drop height, and their durations (up + down each). */
    bounces: [
      { share: 0.16, ms: 360 },
      { share: 0.05, ms: 220 },
    ],
    /** How it lies once down (about the hole), and how long it stays there. */
    landTiltDeg: -96,
    restMs: 3600,
    /** The climb back to its nail. */
    riseMs: 1200,
  },
  /** Point 11: light, shadow and reflections. */
  render: {
    maxPixelRatio: 2,
    /** A warm key from high left in front of the wall, and a soft sky. */
    light: { sun: 2.3, sky: 0.8, sunFrom: [-0.55, 0.85, 1.0] as const },
    /** Reflections: a room environment (PMREM) on the metal, scaled by this. */
    envIntensity: 0.5,
    /** Tone mapping exposure (ACES filmic). */
    exposure: 0.92,
    /** The shadow on the footer's wall: how dark, and how far behind the shoe the wall is (px). */
    shadow: { opacity: 0.42, wallDepthPx: 10, mapSize: 1024 },
  },
} as const;
