/**
 * The wagon trail behind «Programa» ([68-0]) — the one place that tunes it. Lengths are CSS pixels.
 *
 * The route is a smooth curve (Catmull-Rom) through `route`, given as shares of the layer's width and height, so it
 * keeps its shape at every size: it comes in from the left edge low, curls up through the empty paper under the
 * first day, swings down between the two days and leaves by the right edge. The wagon went that way: the horses'
 * toes point to where it was going.
 */
export const WAGON_TRAIL = {
  route: [
    [-0.06, 0.9],
    [0.12, 0.84],
    [0.27, 0.9],
    [0.37, 0.78],
    [0.31, 0.62],
    [0.4, 0.5],
    [0.55, 0.58],
    [0.6, 0.78],
    [0.72, 0.88],
    [0.86, 0.74],
    [0.95, 0.5],
    [1.06, 0.4],
  ] as ReadonlyArray<readonly [number, number]>,
  /** Half the distance between the two wheel ruts, and each rut's width. */
  gauge: 21,
  rut: 6,
  /** One horse, on the road's centre line between the ruts ([68-0] hotfix 1). A horseshoe's width. */
  shoe: 9,
  /** Its two gaits. At a WALK the feet fall one by one, left and right of the line, every `stride` pixels. At a
      GALLOP they fall in quick groups of four (`beats`: distance along the group and side of the line) followed by
      the leap: one group every `stride` pixels; the shoes land a little bigger and more askew, dug in. */
  walk: { stride: 22, spread: 4, speed: 210, wobble: 0.1 },
  gallop: { stride: 96, spread: 5, speed: 720, wobble: 0.06, beats: [[0, -1], [10, 1], [31, -1], [42, 1]] as ReadonlyArray<readonly [number, -1 | 1]>, scale: 1.12, turn: 15 },
  /** Halfway across the screen (this share of the layer's width, the first time the road reaches it) the wagon
      stops for `pause` seconds, then the horse picks up the gallop over `ramp` pixels. */
  halt: { at: 0.5, pause: 0.5, ramp: 180 },
  /** The wagon of «Las Jornadas» and its horse driving the road ([69-0]). Model lengths are metres, as in
      assets/3d/carruaje and assets/3d/caballo; the wagon is scaled so that its wheel `track` spans the two ruts, and
      the road keeps its width. `reach` is the horse (the point on the road under its belly) to the wagon's front axle,
      along the shafts: REACH in make-caballo.py. The horse's legs run on their own rhythm, not stamp by stamp: one
      gait cycle every `cycle` pixels of road, so they go still when the wagon halts and quicken into the gallop. */
  vehicle: {
    track: 1.52,
    wheelbase: 1.7,
    radius: { front: 0.35, rear: 0.44 },
    reach: 2.1,
    maxSteerDeg: 35,
    walk: { cycle: 120, swing: 24, knee: 50 },
    gallop: { cycle: 250, swing: 40, knee: 85 },
    shadowOpacity: 0.22,
    /** The camera looks down at a slant: each metre of height is drawn this many metres up the page. 0 = cenital (as
        on the Jornadas road), where the legs hide under the body. */
    oblique: 0.5,
    light: { sun: 2.4, sky: 1.15 },
  },
  /** Jitter of each print, in pixels and degrees, so the line is walked and not stamped. */
  jitter: { offset: 1.4, turn: 8 },
  /** The whole trail's strength over the paper: an impression, not a drawing. */
  opacity: 0.15,
  /** The wheel ruts alone, over the paper ([68-0] hotfix 3: five points under the hoofprints). */
  rutOpacity: 0.1,
} as const;

/** Pixels per model metre: the wagon's wheel track laid over the two ruts. */
export const WAGON_SCALE = (WAGON_TRAIL.gauge * 2) / WAGON_TRAIL.vehicle.track;
/** How far the front wheels run behind the horse ([68-0] hotfix 2), from the models: the shafts' reach. The ruts are
    pressed this many pixels after the horse passes, never before. */
export const WHEEL_LAG = WAGON_TRAIL.vehicle.reach * WAGON_SCALE;
