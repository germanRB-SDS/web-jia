import type { Experience } from "./types";

/**
 * EXPERIENCES. No real case has been identified yet (brief §7). The two entries
 * below are `demo`: they exist so the card/sheet mechanism can be reviewed and
 * are labelled as demonstration in the interface. Replace them with real cases
 * (status "confirmed"/"provisional") or empty the array to show the pending state.
 */
export const experiences: readonly Experience[] = [
  { id: "x-demo-1", personIds: [], mediaId: null, fallbackSurface: "card", relatedWorkshopIds: ["w-podcast"], sheet: { kind: "text" }, status: "demo" },
  { id: "x-demo-2", personIds: [], mediaId: null, fallbackSurface: "card", relatedWorkshopIds: ["w-stopmotion"], sheet: { kind: "text" }, status: "demo" },
];
