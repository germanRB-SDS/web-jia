/**
 * Jornadas road — the one place that tunes the animated wagon route.
 *
 * Coordinates: the map lies on the XZ plane, +Y is up, the camera looks straight down.
 * Layout points are authored in a "design box" (x to the right, y DOWN on screen, in map
 * units); the scene maps design (x, y) → world (x, 0, y). The box is fitted into the
 * component's width, so every size below scales with the column.
 *
 * Stops are not authored one by one: each layout lists stop SLOTS (a stretch of the road and
 * the design point the disc sits at), in travel order. The scene takes as many slots as there
 * are workshops (config/talleres.ts). Each slot also says where its label goes, because the
 * road of JIA-2026-09-18-10 follows the promoter's hand sketch (a loop between stops 2 and 3)
 * and a label to the right of stop 2 would land inside the loop.
 *
 * Colours are palette tokens (app/theme/palette.css) resolved at runtime; no brand HEX here.
 */

export type LayoutName = "wide" | "narrow";

export type StopSlot = {
  /** Control-point index range [from, to] the disc is searched in (keeps the loop's crossing unambiguous). */
  run: [number, number];
  /** Design point of the disc; the scene snaps it to the closest point of the road inside `run`. */
  at: [number, number];
  /** Which slots are used first: with N workshops the N lowest priorities are taken, then re-sorted by travel order. */
  priority: number;
  /** Label placement relative to the disc: side (default right) and nudges in units (dx away from the disc, dy down). */
  label?: { side?: "left" | "right"; dx?: number; dy?: number };
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
  /** Space kept free beside every disc for its label (units): disc + half the wagon's width. */
  labelOffsetUnits: number;
  /** Width a label may take (units) before wrapping. */
  labelMaxUnits: number;
};

export const ROUTE_LAYOUTS: Record<LayoutName, RouteLayout> = {
  // Desktop column (~480 px). The hand sketch (docs/prompts/assets/JIA-2026-09-18-10-boceto-camino.png):
  // a short tail, stop 1 bottom-left, a rise to the right into a closed loop (stop 2 on its left side),
  // out through the crossing down to stop 3, up a bend into a near-vertical run (4, 5) and a last
  // curve to the right (6). The loop keeps R ≈ 10 u; the wagon scale follows from it (R ≥ wheelbase / tan 35°).
  wide: {
    box: { w: 100, h: 77 },
    points: [
      [5, 74], [8, 70], [11, 66], [16, 60.5], [23, 57.8], [30, 57.2],
      [37, 56], [45, 51], [49.5, 43], [46, 35], [39, 32.5], [32.5, 36.5], [30.5, 44], [32.5, 51], [37.5, 56.5],
      [41.5, 61], [46, 63.3], [52, 61.5], [57, 56], [60.5, 49],
      [62.3, 42], [62.8, 34], [63, 27], [63.4, 20], [65.2, 14.5], [68.5, 10.5],
    ],
    slots: [
      { run: [1, 3], at: [11, 66], priority: 1 },
      { run: [11, 13], at: [30.5, 44], priority: 2, label: { side: "left" } },
      { run: [15, 17], at: [46, 63.3], priority: 3, label: { dy: 5 } },
      { run: [17, 19], at: [57, 56], priority: 7 },
      { run: [19, 21], at: [62.3, 42], priority: 4 },
      { run: [21, 23], at: [63, 27], priority: 5 },
      { run: [22, 24], at: [63.6, 18.5], priority: 8 },
      { run: [24, 25], at: [68.5, 10.5], priority: 6, label: { dx: 3, dy: 2.5 } },
    ],
    bumpPoints: [
      { point: 4, strength: 1 },
      { point: 10, strength: 0.8 },
      { point: 18, strength: 1 },
    ],
    wagonScale: 4.0,
    labelOffsetUnits: 5.8,
    labelMaxUnits: 27,
  },
  // Phone (< 600 px): the same drawing in a taller box; the run sits further left so the labels of
  // stops 4–6 keep a usable width, and the loop stays round enough for the wagon.
  narrow: {
    box: { w: 100, h: 115 },
    points: [
      [7, 112], [10, 107], [13, 101], [18, 93], [25, 88.5], [32, 86.5],
      [38.5, 83], [47.5, 77], [52, 67], [48.5, 58], [41.5, 54.5], [34.5, 58], [31.5, 67], [33.5, 76], [39, 83.5],
      [45, 90], [51, 93.5], [57.5, 91.5], [61, 84], [62.3, 74],
      [62.6, 63], [62.8, 51], [63, 40], [63.3, 29], [64.5, 20], [66.5, 14],
    ],
    slots: [
      { run: [1, 3], at: [13, 101], priority: 1 },
      { run: [11, 13], at: [31.5, 67], priority: 2, label: { side: "left" } },
      { run: [15, 17], at: [51, 93.5], priority: 3, label: { dy: 7 } },
      { run: [18, 19], at: [62, 78], priority: 7 },
      { run: [19, 21], at: [62.6, 63], priority: 4 },
      { run: [21, 23], at: [63, 40], priority: 5 },
      { run: [22, 24], at: [63.5, 27], priority: 8 },
      { run: [24, 25], at: [66.5, 14], priority: 6, label: { dx: 2.5, dy: 3.5 } },
    ],
    bumpPoints: [
      { point: 4, strength: 1 },
      { point: 10, strength: 0.8 },
      { point: 18, strength: 1 },
    ],
    wagonScale: 3.6,
    labelOffsetUnits: 5.4,
    labelMaxUnits: 32,
  },
};

/**
 * The slots used for `count` stops, in travel order; null when the layout has fewer slots than
 * workshops (the scene then spreads the stops evenly). Shared by the scene (disc positions) and
 * the component (label placement), so both always agree.
 */
export function chooseSlots(layout: RouteLayout, count: number): StopSlot[] | null {
  if (count > layout.slots.length) return null;
  return layout.slots
    .map((slot, index) => ({ slot, index }))
    .sort((a, b) => a.slot.priority - b.slot.priority)
    .slice(0, count)
    .sort((a, b) => a.index - b.index)
    .map((s) => s.slot);
}

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
    /** Hand-drawn character: relative wobble of the road's width and of each disc's outline. Both 0 since
        JIA-2026-09-18-13 (the promoter wants an even line and round stops); -10 used 0.16 / 0.17. */
    handDrawn: { width: 0, disc: 0 },
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
