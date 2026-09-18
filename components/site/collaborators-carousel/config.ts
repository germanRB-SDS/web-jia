/** The collaborators' carousel (JIA-2026-09-18-23) — the one place that tunes how it moves. */
export const COLLABORATORS_CAROUSEL = {
  /** Pixels the pointer travels before a press becomes a drag (and stops being a click). */
  dragThreshold: 6,
  /** Milliseconds of pointer history the release speed is measured over. */
  velocityWindow: 90,
  /** Time constant of the glide after a release, in milliseconds: the larger, the longer it coasts. */
  glide: 320,
  /** The strip's own pace while nobody drags it, in pixels per second: cards come in from the right. */
  drift: 28,
  /** Time constant, in milliseconds, of the drift picking up and slowing down (pointer over it, focus inside). */
  driftEase: 450,
  /** Milliseconds the strip waits after a drag, a wheel or a key before it drifts again. */
  driftResume: 1400,
  /** Sets of cards rendered before the first measure; the engine asks for more on wide screens. */
  minCopies: 3,
  maxCopies: 8,
} as const;
