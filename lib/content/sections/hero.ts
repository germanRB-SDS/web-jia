import type { SurfaceToken } from "../data/types";

/** HERO configuration: which photograph, its alternate, and where the two actions point. */
export const heroConfig = {
  id: "inicio",
  mediaId: "hero-saloon" as string | null,
  /** Other hero frames registered in media.ts; swap `mediaId` to try them. */
  alternateMediaIds: ["hero-1", "hero-1-full", "hero-2"],
  fallbackSurface: "sand" as SurfaceToken,
  /** The #JIA26 seal to the right of the "JIA" wordmark, as tall as it, in place of the lettering (promoter,
      JIA-2026-09-19-30: the edition's title under it already says the name); null brings the lettering back. */
  sealMediaId: "sello-jia26" as string | null,
  /** `icon` names a member of the icon family for the button, as `waypoints` do below; without it the action keeps
      the default arrow. Icons: sheriff-star. */
  actions: {
    primary: { target: "jornadas", icon: "sheriff-star" },
    secondary: { target: "talleres" },
  },
  /** Ordered shortcuts under the hero. Icons: hat | cactus | compass | lantern (the linear family) or, since [67-0],
      the promoter's filled ones: hoofprints (two horseshoes, a horse's steps) | board (the blackboard) | lamp. */
  waypoints: [
    { id: "programa", icon: "hoofprints", target: "programa" },
    { id: "talleres", icon: "board", target: "talleres" },
    { id: "experiencias", icon: "lamp", target: "experiencias" },
  ] as const,
} as const;
