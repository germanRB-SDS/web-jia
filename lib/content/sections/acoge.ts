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
  mediaIds: [null, null] as (string | null)[],
  surfaces: ["sand", "olive"] as SurfaceToken[],
} as const;
