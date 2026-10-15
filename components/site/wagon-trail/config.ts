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
  /** Two horses abreast between the ruts: their lines sit at ± this share of the gauge; each hoof steps this far to
      either side of its horse's line, every `stride` along the way. */
  horses: 0.42,
  hoofSpread: 4,
  stride: 24,
  /** A horseshoe's width. */
  shoe: 9,
  /** Jitter of each print, in pixels and degrees, so the line is walked and not stamped. */
  jitter: { offset: 1.6, turn: 9 },
  /** The whole trail's strength over the paper: an impression, not a drawing. */
  opacity: 0.15,
  /** Seconds the wagon takes to cross, once, the first time the trail comes into view. */
  pass: 5.5,
} as const;
