import { ENLACES } from "../config/enlaces";

/**
 * PROPUESTAS. `url` is the canonical destination of the "present a proposal"
 * action (config/enlaces.ts). While null, the action renders as unavailable with the copy message.
 */
export const propuestasConfig = {
  id: "propuestas",
  url: ENLACES.formularioPropuesta as string | null,
  external: true,
  /** Visual column on the right; null falls back to a parchment surface. */
  mediaId: "propuestas-hoguera" as string | null,
} as const;
