import type { SurfaceToken } from "../data/types";

/**
 * ACOGE JIA. `url` is the external hosting form supplied by the organisation.
 * While null, the action renders as unavailable. `surfaces` are the solid
 * colour blocks used until photographs exist; swap for media ids in `mediaIds`.
 */
export const acogeConfig = {
  id: "acoge",
  url: null as string | null,
  external: true,
  mediaIds: ["hero-2-place", null] as (string | null)[],
  surfaces: ["card", "card"] as SurfaceToken[],
} as const;
