/**
 * PROPUESTAS. `url` is the canonical destination of the "present a proposal"
 * action. While null, the action renders as unavailable with the copy message.
 */
export const propuestasConfig = {
  id: "propuestas",
  url: null as string | null,
  external: true,
  /** Visual column on the right; null falls back to a parchment surface. */
  mediaId: "propuestas-camara" as string | null,
} as const;
