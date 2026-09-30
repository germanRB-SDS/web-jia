import type { Resource } from "./types";

/**
 * DOSSIERS / RESOURCES. Empty until the organisation supplies documents.
 * A resource with `url: null` renders without an active action (brief §6).
 * Example shape:
 * { id: "r-podcast-guia", format: "pdf", url: "/dosieres/podcast.pdf", language: "es",
 *   relatedWorkshopIds: ["w-podcast"], relatedExperienceIds: [], status: "confirmed" }
 */
export const resources: readonly Resource[] = [];
