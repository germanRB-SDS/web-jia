import type { SurfaceToken } from "../data/types";

/**
 * SOCIOS ("Quién hace posible las JIA"). The collaborators' cards show a solid palette surface until
 * the promoter supplies each photograph with its logotype: then `logoMediaId` in data/organizations.ts
 * fills the same slot and the surface stays as its fallback.
 */
export const sociosConfig = {
  id: "socios",
  cardSurfaces: {
    "o-south-desert-studio": "terracotta",
    "o-minihollywood": "copper",
    "o-leonardo": "olive",
    "o-kichigarcia": "terracotta-deep",
    "o-gata-purpura": "dune",
  } as Record<string, SurfaceToken>,
  /** A collaborator added to the data before it gets a colour here. */
  fallbackSurface: "card" as SurfaceToken,
} as const;
