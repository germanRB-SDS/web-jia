/**
 * Jornadas road — the one place that tunes the animated wagon route.
 *
 * Coordinates: the map lies on the XZ plane, +Y is up, the camera looks straight down.
 * Layout points are authored in a "design box" (x to the right, y DOWN on screen, in map
 * units); the scene maps design (x, y) → world (x, 0, y). The box is fitted into the
 * component's width, so every size below scales with the column.
 *
 * Colours are palette tokens (app/theme/palette.css) resolved at runtime; no brand HEX here.
 */

export type LayoutName = "wide" | "narrow";

export type RouteLayout = {
  /** Design box the camera frames (units). Its aspect ratio is also the CSS aspect-ratio. */
  box: { w: number; h: number };
  /** Control points of the road, in order (CatmullRom, centripetal). */
  points: [number, number][];
  /** Six stops as indices into `points`, in visiting order. */
  stopPoints: [number, number, number, number, number, number];
  /** Road irregularities as indices into `points` (kept away from stops). */
  bumpPoints: { point: number; strength: number }[];
  /** Space kept free to the right of every disc for its label (map units): disc + half the wagon's width. */
  labelOffsetUnits: number;
};

export const ROUTE_LAYOUTS: Record<LayoutName, RouteLayout> = {
  // Desktop column (~480 px). The road starts bottom-left and ends top-right: three vertical
  // runs (up, down, up) joined by two wide U-turns (R ≈ 15 units); labels live in the gaps.
  wide: {
    box: { w: 100, h: 74 },
    points: [
      [10, 64.5], [9.2, 55], [11, 43], [9.6, 31], [11, 22], [17, 12], [25, 8], [33, 12], [39, 22],
      [41, 29], [39.4, 41], [40.6, 51], [41, 57], [46, 66], [55, 70], [64, 66], [69, 57],
      [70.6, 44], [69.4, 30], [70, 16], [70, 8],
    ],
    stopPoints: [1, 3, 9, 11, 17, 19],
    bumpPoints: [
      { point: 6, strength: 1 },
      { point: 14, strength: 0.8 },
      { point: 18, strength: 1 },
    ],
    labelOffsetUnits: 7.6,
  },
  // Phone (< 600 px): same road, taller box so the three runs keep their U-turn radius.
  narrow: {
    box: { w: 100, h: 104 },
    points: [
      [10, 96], [9.2, 86], [11, 70], [9.6, 58], [11, 40], [12, 30], [17, 18], [25, 12], [33, 18],
      [39, 30], [41, 42], [39.4, 56], [40.6, 68], [41, 80], [46, 90], [55, 94], [64, 90], [69, 80],
      [70.6, 66], [69.4, 48], [70, 30], [70, 20],
    ],
    stopPoints: [1, 3, 10, 12, 18, 20],
    bumpPoints: [
      { point: 7, strength: 1 },
      { point: 15, strength: 0.8 },
      { point: 19, strength: 1 },
    ],
    labelOffsetUnits: 7.2,
  },
};

/** Viewport rule that picks the layout; the CSS aspect-ratio in JornadasRoute.module.css mirrors it. */
export const NARROW_MEDIA = "(max-width: 599px)";

export const ROUTE_CONFIG = {
  wagon: {
    /** Map units per model unit. The model is 3.04 units long → 18.2 map units (~87 px in a 480 px column). */
    scale: 6.0,
    /** Verified in assets/3d/carruaje/VALIDATION.md (model units, before scale). */
    model: { length: 3.04, width: 1.78, wheelbase: 1.7, frontRadius: 0.35, rearRadius: 0.44 },
    /** glTF axes of the asset (HANDOFF-SPLINE.md §3): forward −Z, up +Y, right +X; wheels spin about local X (−d/r), steer about local Y (+ = left). */
    axes: { forward: "-Z", up: "+Y", wheelSpin: "X", steer: "Y" },
    nodes: {
      root: "JIA_Wagon_ROOT",
      body: "JIA_BodyMotion",
      steer: "JIA_FrontSteer",
      wheels: { FL: "JIA_Wheel_FL", FR: "JIA_Wheel_FR", RL: "JIA_Wheel_RL", RR: "JIA_Wheel_RR" },
    },
    /** Clean geometric range is ±37° (validation); the U-turns need ~34° with this scale and radius. */
    maxSteerDeg: 34,
    /** Look-ahead used to estimate curvature (map units). */
    curvatureStep: 1.0,
  },
  road: {
    width: 2.4,
    discRadius: 2.0,
    colors: { road: "--jia-sand-deep", disc: "--jia-line", discActive: "--jia-terracotta" },
    shadowOpacity: 0.22,
    /** Stacking on Y to avoid z-fighting: road, discs, shadow catcher, wagon. */
    y: { road: 0.02, disc: 0.035, shadow: 0.05, wagon: 0.05 },
    ribbonSegments: 400,
  },
  timing: {
    reveal: 1.0,
    discIn: 0.3,
    discStagger: 0.06,
    wagonIn: 0.25,
    /** Cruise speed on the road (map units / s) and the deliberate ramps at each departure/arrival (s). */
    speed: 20,
    accel: 0.55,
    decel: 0.65,
    dwell: 0.85,
    discActivate: 0.3,
  },
  motion: {
    rollDeg: 0.8,
    rollWavelength: 4.5,
    pitchAccelDeg: 0.9,
    bumpPitchDeg: 2.0,
    bumpLift: 0.03,
    bumpDecay: 5,
    bumpWavelength: 3.2,
    smoothing: 8,
  },
  render: {
    maxPixelRatio: 2,
    /** Fraction of the component that must be on screen to start / keep playing. */
    visibleThreshold: 0.35,
    light: { sun: 2.4, sky: 1.15 },
  },
} as const;
