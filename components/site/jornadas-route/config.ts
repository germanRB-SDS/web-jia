/**
 * Jornadas road — the one place that tunes the animated wagon route.
 *
 * Coordinates: the map lies on the XZ plane, +Y is up, the camera looks straight down.
 * Layout points are authored in a "design box" (x to the right, y DOWN on screen, in map
 * units); the scene maps design (x, y) → world (x, 0, y). The box is fitted into the
 * component's width, so every size below scales with the column.
 *
 * Stops are not authored one by one: each layout lists stop SLOTS (a vertical run of the road
 * and a screen-y on it), in travel order and each with a distinct y, so labels never share a
 * line. The scene takes as many slots as there are workshops (config/talleres.ts).
 *
 * Colours are palette tokens (app/theme/palette.css) resolved at runtime; no brand HEX here.
 */

export type LayoutName = "wide" | "narrow";

export type StopSlot = {
  /** Control-point index range [from, to] of the straight run this slot sits on. */
  run: [number, number];
  /** Screen y (design units) of the disc; unique within the layout and inside the run's y-range. */
  y: number;
  /** Which slots are used first: with N workshops the N lowest priorities are taken, then re-sorted by travel order. */
  priority: number;
};

export type RouteLayout = {
  /** Design box the camera frames (units). Its aspect ratio is also the CSS aspect-ratio. */
  box: { w: number; h: number };
  /** Control points of the road, in order (CatmullRom, centripetal). */
  points: [number, number][];
  /** Candidate stop positions in travel order (see above). More slots than workshops is fine. */
  slots: StopSlot[];
  /** Road irregularities as indices into `points` (kept away from the slots). */
  bumpPoints: { point: number; strength: number }[];
  /** Map units per model unit for this layout (the wagon is 3.04 model units long). */
  wagonScale: number;
  /** Space kept free to the right of every disc for its label (units): disc + half the wagon's width. */
  labelOffsetUnits: number;
  /** Width a label may take (units) before wrapping. */
  labelMaxUnits: number;
};

export const ROUTE_LAYOUTS: Record<LayoutName, RouteLayout> = {
  // Desktop column (~480 px). Bottom-left → top-right as an "N": a run up the left, a wide bend
  // into a steep diagonal down, a wide bend up the right run. Labels sit right of both runs.
  wide: {
    box: { w: 100, h: 74 },
    points: [
      [5, 71], [5.3, 62], [5.6, 52], [5.4, 42], [5.8, 32],
      [7.5, 22], [12, 14.5], [19, 10.5], [26, 12], [30.5, 18],
      [35, 32], [39.5, 46], [43, 56],
      [46, 63], [51, 68], [57, 70], [63, 67.5], [66.5, 61], [67.5, 54],
      [67.2, 44], [67.6, 34], [67.1, 22], [67.4, 12], [67.4, 5],
    ],
    slots: [
      { run: [0, 4], y: 66, priority: 1 },
      { run: [0, 4], y: 50, priority: 2 },
      { run: [0, 4], y: 34, priority: 7 },
      { run: [18, 23], y: 52, priority: 3 },
      { run: [18, 23], y: 41, priority: 4 },
      { run: [18, 23], y: 30, priority: 5 },
      { run: [18, 23], y: 19, priority: 6 },
      { run: [18, 23], y: 9, priority: 8 },
    ],
    bumpPoints: [
      { point: 7, strength: 1 },
      { point: 11, strength: 0.8 },
      { point: 15, strength: 1 },
    ],
    wagonScale: 5.2,
    labelOffsetUnits: 7.2,
    labelMaxUnits: 25,
  },
  // Phone (< 600 px): same "N", taller box, smaller wagon so the bends keep a drivable radius.
  narrow: {
    box: { w: 100, h: 104 },
    points: [
      [6, 100], [6.3, 88], [6.6, 74], [6.4, 60], [6.8, 46],
      [8.5, 34], [13, 24], [20, 18], [27, 19.5], [31.5, 26],
      [35.5, 44], [39.5, 62], [42, 74],
      [44.5, 82], [48.5, 88.5], [54, 91], [58.5, 88], [60.5, 81], [61, 74],
      [60.7, 62], [61.2, 50], [60.8, 38], [61.1, 26], [61.2, 14], [61.2, 8],
    ],
    slots: [
      { run: [0, 4], y: 94, priority: 1 },
      { run: [0, 4], y: 78, priority: 2 },
      { run: [0, 4], y: 62, priority: 7 },
      { run: [18, 24], y: 72, priority: 3 },
      { run: [18, 24], y: 58, priority: 4 },
      { run: [18, 24], y: 44, priority: 5 },
      { run: [18, 24], y: 30, priority: 6 },
      { run: [18, 24], y: 14, priority: 8 },
    ],
    bumpPoints: [
      { point: 7, strength: 1 },
      { point: 11, strength: 0.8 },
      { point: 15, strength: 1 },
    ],
    wagonScale: 4.6,
    labelOffsetUnits: 6.4,
    labelMaxUnits: 32,
  },
};

/** Viewport rule that picks the layout; the component's inline aspect-ratio follows it. */
export const NARROW_MEDIA = "(max-width: 599px)";

export const ROUTE_CONFIG = {
  wagon: {
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
    /** Clean geometric range is ±37° (validation); the bends need ~35° with these scales and radii. */
    maxSteerDeg: 35,
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
    /** Halved from 0.85 s at the promoter's request (JIA-2026-09-18-09). */
    dwell: 0.42,
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
