import type { Metadata } from "next";
import { edition, site } from "@/lib/content";

// Reuse the current landing so the deployed edition cannot drift from the local preview.
export { default } from "../page";

export const metadata: Metadata = {
  alternates: { canonical: new URL(edition.path, site.url).href },
};
