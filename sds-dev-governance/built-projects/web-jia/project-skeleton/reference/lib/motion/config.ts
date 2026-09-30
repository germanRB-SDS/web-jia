/** Preference data is deliberately limited to one opt-in value. */
export const MOTION = {
  cookie: "__Host-jia-motion",
  value: "on",
  maxAge: 180 * 24 * 60 * 60,
  reduceQuery: "(prefers-reduced-motion: reduce)",
  normalQuery: "(prefers-reduced-motion: no-preference)",
} as const;
