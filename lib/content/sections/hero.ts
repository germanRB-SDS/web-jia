import type { SurfaceToken } from "../data/types";

/** HERO configuration: which photograph, its alternate, and where the two actions point. */
export const heroConfig = {
  id: "inicio",
  mediaId: "hero-1" as string | null,
  /** Other hero crops registered in media.ts; swap `mediaId` to try them. */
  alternateMediaIds: ["hero-1-full", "hero-2"],
  fallbackSurface: "sand" as SurfaceToken,
  /** The #JIA26 seal to the right of the "JIA" wordmark, as tall as it, in place of the lettering (promoter,
      JIA-2026-09-19-30: the edition's title under it already says the name); null brings the lettering back. */
  sealMediaId: "sello-jia26" as string | null,
  actions: {
    primary: { target: "jornadas" },
    secondary: { target: "talleres" },
  },
  /** Ordered shortcuts under the hero. Icons: hat | cactus | compass | lantern. */
  waypoints: [
    { id: "programa", icon: "compass", target: "programa" },
    { id: "talleres", icon: "hat", target: "talleres" },
    { id: "experiencias", icon: "lantern", target: "experiencias" },
  ] as const,
} as const;
