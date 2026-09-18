/**
 * Cube carousel — the one place that tunes the rotating cube.
 *
 * The cube is a four-sided prism that turns about its vertical axis. It is not a real cube:
 * while a side is hidden at the back it is reloaded with the next (or previous) item of the
 * sequence, so turning it walks through 1…n and starts over, in either direction, forever.
 *
 * Geometry lives in CubeCarousel.module.css as custom properties (size, edge and corner radii,
 * perspective, colour): everything is relative to --cube-size, so there is no resize code.
 */
export const CUBE_CONFIG = {
  /** Sides of the prism (the CSS places them every 90°). */
  faces: 4,
  /** Facets that approximate each rounded vertical edge (the CSS places them every 90° / strips). */
  edgeStrips: 3,
  drag: {
    /** A quarter turn takes a drag of this many cube widths. */
    widthsPerQuarterTurn: 0.85,
    /** Pixels before a press counts as a drag (taps and vertical scrolls pass through). */
    minimumMovement: 4,
    /** Seconds the cube takes to catch up with the pointer (the example's `gsap.to` follow). */
    follow: 0.35,
    /** Release: part of the pointer speed (px/s → px) that is thrown forward before snapping. */
    throwSeconds: 0.22,
    /** Most quarter turns a single throw may add. */
    maxThrowSteps: 3,
    /** A drag shorter than half a side still advances once it passes this many degrees. */
    advanceAfterDeg: 18,
    settle: 0.8,
  },
  step: { duration: 0.9, ease: "power2.inOut" },
  /** Idle turning: only while on screen, never with reduced motion, and it stops for good at the first interaction. */
  autoplay: { enabled: true, interval: 3.4, firstDelay: 1.6 },
  /** "Light source" (the example dims with opacity; here a tint, so the page never shows through). 0..1 at 90°. */
  shade: { towardsRight: 0.62, towardsLeft: 0.44 },
  /** How many items ahead/behind are fetched before they can come into view. */
  preloadRadius: 4,
} as const;
