import type { SurfaceToken } from "../data/types";

/**
 * SOCIOS ("Quiénes somos", renamed from "Quién hace posible las JIA" in JIA-2026-09-20-45). Each collaborator's card shows its image (`logoMediaId` in
 * data/organizations.ts); the solid palette surface below is what the same slot shows if one is missing.
 */
export const sociosConfig = {
  id: "socios",
  /** The carousel's cards, in order: the Junta (an organiser, at the promoter's request) and the collaborators. */
  carouselIds: ["o-junta", "o-south-desert-studio", "o-minihollywood", "o-leonardo", "o-kichigarcia", "o-gata-purpura"],
  cardSurfaces: {
    "o-junta": "sand",
    "o-south-desert-studio": "terracotta",
    "o-minihollywood": "copper",
    "o-leonardo": "olive",
    "o-kichigarcia": "terracotta-deep",
    "o-gata-purpura": "dune",
  } as Record<string, SurfaceToken>,
  /** A collaborator added to the data before it gets a colour here. */
  fallbackSurface: "card" as SurfaceToken,
} as const;
