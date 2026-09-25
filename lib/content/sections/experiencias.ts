import type { SurfaceToken } from "../data/types";

/**
 * Set `showDemo` to false to hide demo entries and show the pending state instead. The section's ground is a
 * full-bleed photograph (`mediaId`) whose clear left half carries the text; with no media it is plain vellum.
 *
 * Since [51-0] that ground is a stack of layers: the photograph (`mediaId`), the window light drawn over it, and
 * the same teacher cut out of the same frame (`cutoutMediaId`) laid back on top, so the light passes behind her.
 * Set `cutoutMediaId` to null and the section loses the depth but keeps the photograph and the text.
 */
export const experienciasConfig = {
  id: "experiencias",
  showDemo: true,
  mediaId: "experiencias-aula" as string | null,
  cutoutMediaId: "experiencias-maestra" as string | null,
  fallbackSurface: "card" as SurfaceToken,
} as const;
