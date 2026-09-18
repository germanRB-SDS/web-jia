import type { SurfaceToken } from "../data/types";

/**
 * SOCIOS ("Quién hace posible las JIA"). Each collaborator's card shows its image (`logoMediaId` in
 * data/organizations.ts); the solid palette surface below is what the same slot shows if one is missing.
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
