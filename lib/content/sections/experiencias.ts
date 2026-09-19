import type { SurfaceToken } from "../data/types";

/**
 * Set `showDemo` to false to hide demo entries and show the pending state instead. The section's ground is a
 * full-bleed photograph (`mediaId`) whose clear left half carries the text; with no media it is plain vellum.
 */
export const experienciasConfig = {
  id: "experiencias",
  showDemo: true,
  mediaId: "experiencias-aula" as string | null,
  fallbackSurface: "card" as SurfaceToken,
} as const;
