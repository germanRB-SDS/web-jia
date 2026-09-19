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
  /** The eye (JIA-2026-09-19-28…30): a narrow perspective. While the shoe hangs, drops and bounces the eye is level
      with the block's centre (the shoe is seen head-on, the wall 1:1); as the shoe falls over the eye rises to
      `elevationPx`, so the floor (the rule) is seen from above, and it comes back down when the shoe climbs back. */
  camera: { fovDeg: 20, elevationPx: 380 },
  /** The floor: this far from the wall's foot towards the eye and away from it (px). Invisible but for the shadow. */
  floor: { depthPx: 420 },
  /** Point 10, simplified in JIA-2026-09-19-30: a double click and the shoe lets go of its nail (which stays where
      it is). With x across, y up and z towards the eye: it drops straight down (only y changes), bounces twice on
      the rule (only y), comes to rest standing, and only then falls over backwards — the ends of the U away from
      the eye — until it lies on the floor. Times in ms; angles in degrees. */
  fall: {
    /** What lets it go: a double click on the button over the shoe (a single click does nothing); with the
        keyboard, Enter or Space on that button. */
    trigger: "dblclick" as "click" | "dblclick",
    /** A minimal wobble before it lets go (0 ms: none). */
    swingMs: 140,
    swingDeg: 3,
    /** The drop to the rule (the floor), under gravity (a quadratic ease). */
    fallMs: 600,
    /** Two bounces, each as a share of the drop height; gravity sets how long each one lasts
        (2 × fallMs × √share). */
    bounces: [0.13, 0.035],
    /** How it lands: turned in its own plane, about its own centre (it does not move sideways), to stand on its
        arch with the ends of the U up; it rocks this much about that as it bounces. Then a short pause, standing. */
    landTiltDeg: 20,
    rockDeg: 4,
    standMs: 180,
    /** Then it falls over backwards about the point it stands on: tipped until it lies on the floor (degrees from
        the vertical, −90 would be flat; negative sends the ends of the U away from the eye, positive would show
        it edge-on). Slow at first and a little faster as it goes; it does not bounce. The eye rises meanwhile. */
    landTipDeg: -74,
    tipMs: 900,
    tipEase: "power1.in",
    /** The shoe on the floor stays whole above the rule: its lowest point on screen this far above the block's bottom. */
    floorMarginPx: 2,
    restMs: 5000,
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
