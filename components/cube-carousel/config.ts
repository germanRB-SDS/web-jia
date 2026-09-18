/**
 * Cube carousel — the one place that tunes the rotating cube.
 *
 * A true cube (six sides, sharp edges) that shows a whole sequence. It turns about its vertical
 * axis, and every `verticalEvery`-th step it rolls about the horizontal one instead: going
 * forward the top side brings the next item, going back over that same boundary the bottom side
 * brings the previous one (the opposite roll). It is not a real cube: a side is reloaded with
 * the next (or previous) item while it cannot be seen, so the sequence 1…n goes round forever.
 *
 * Geometry and colour live in CubeCarousel.module.css as custom properties, all relative to
 * --cube-size, so there is no resize code.
 */
/** Seconds a step takes, whichever way the cube goes: a vertical roll lasts exactly as long as a horizontal turn. */
const STEP_SECONDS = 0.9;

export const CUBE_CONFIG = {
  /** Sides around the vertical axis (the CSS places them every 90°). */
  faces: 4,
  /** Steps per vertical roll: the step INTO item 4, 8, 12… rolls (and the step back out of them rolls the other way). */
  verticalEvery: 4,
  drag: {
    /** A quarter turn takes a drag of this many cube widths. */
    widthsPerQuarterTurn: 0.85,
    /** Pixels before a press counts as a drag (taps and vertical scrolls pass through). */
    minimumMovement: 4,
    /** Seconds the cube takes to catch up with the pointer (the example's `gsap.to` follow). */
    follow: 0.35,
    /** Release: part of the pointer speed (px/s → px) that is thrown forward before snapping. */
    throwSeconds: 0.22,
    /** A drag shorter than half a side still advances once it passes this many degrees. */
    advanceAfterDeg: 18,
    /** How far (in sides) a horizontal drag may lean over a boundary that belongs to a vertical roll. */
    overshoot: 0.12,
    settle: 0.8,
  },
  /** Pose on page load only: turned this many degrees towards the next item, so two sides show. The first move of any kind squares the cube for good. */
  initialTurn: 14,
  step: { duration: STEP_SECONDS, ease: "power2.inOut" },
  roll: { duration: STEP_SECONDS, ease: "power2.inOut", /** The cube shrinks this much mid-roll, so its diagonal clears the caption. */ dip: 0.14 },
  /** Idle turning: only while on screen, never with reduced motion, and it stops for good at the first interaction. */
  autoplay: { enabled: true, interval: 3.4, firstDelay: 1.6 },
  /** "Light source" (the example dims with opacity; here a tint, so the page never shows through). 0..1 at 90°. */
  shade: { towardsRight: 0.6, towardsLeft: 0.4, vertical: 0.5 },
  /** Bullet holes a single item keeps (the oldest goes first). A hole stays on its item, whichever side shows it. */
  shot: { maxPerItem: 6 },
  /** How many items ahead/behind are fetched before they can come into view. */
  preloadRadius: 4,
} as const;
