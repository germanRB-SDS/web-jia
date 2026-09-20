import type { SurfaceToken } from "../data/types";

/**
 * ACOGE JIA. `url` is the external hosting form supplied by the organisation.
 * While null, the action renders as unavailable. The band is a full-bleed
 * photograph (`mediaId`) whose clear right side carries the text; with no
 * media it falls back to a solid palette surface.
 */
export const acogeConfig = {
  id: "acoge",
  url: null as string | null,
  external: true,
  mediaId: "acoge-indio" as string | null,
  fallbackSurface: "sand" as SurfaceToken,
} as const;
