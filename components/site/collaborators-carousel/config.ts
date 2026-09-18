/** The collaborators' carousel (JIA-2026-09-18-23) — the one place that tunes how it moves. */
export const COLLABORATORS_CAROUSEL = {
  /** Pixels the pointer travels before a press becomes a drag (and stops being a click). */
  dragThreshold: 6,
  /** Milliseconds of pointer history the release speed is measured over. */
  velocityWindow: 90,
  /** Time constant of the glide after a release, in milliseconds: the larger, the longer it coasts. */
  glide: 320,
  /** Milliseconds without wheel input before the track settles on a card. */
  wheelSettle: 140,
  /** Sets of cards rendered before the first measure; the engine asks for more on wide screens. */
  minCopies: 3,
  maxCopies: 8,
} as const;
