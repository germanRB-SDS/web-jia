/** One owner for the workshop deck's mobile geometry and visit interaction policy. */
export const WORKSHOP_DECK = {
  mobileMedia: "(max-width: 759.98px)",
  idleMs: 5000,
  gestureThresholdPx: 6,
  gestureTailMs: 750,
  posterInset: "5%",
} as const;
