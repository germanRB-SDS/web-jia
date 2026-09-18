/**
 * Content entities (brief §11). These are plain objects, not a database.
 * Unknown data is `null`, never a made-up value. Two independent states exist:
 * `status` (editorial state of the content) and availability (whether a URL,
 * file or image actually exists), which lives on the field itself.
 */
export type EditorialStatus =
  | "confirmed" // stated by the organisation or printed on an official asset
  | "provisional" // proposed wording, awaiting validation
  | "pending" // no content yet
  | "demo"; // illustrative sample that must never be published as fact

export type Provenance = {
  /** Where the value was read from (asset path, brief section, "organisation"). */
  source: string;
  note?: string;
};

/** Palette token used as a solid surface when an image is missing (see app/theme/palette.css). */
export type SurfaceToken = "sand" | "card" | "copper" | "olive" | "terracotta" | "ink";

export type PersonRole =
  | "tallerista"
  | "asesoria-cep"
  | "coordinacion"
  | "coordinacion-cep"
  | "colaboracion";

export type Person = {
  id: string;
  /** Name exactly as printed on the asset it was read from. */
  name: string;
  role: PersonRole;
  /** Role label as printed on the team card, e.g. "Asesora CEP". Kept verbatim (asset fact). */
  cardRoleLabel: string | null;
  /** Team card image (media id) or null. */
  cardMediaId: string | null;
  status: EditorialStatus;
  provenance: Provenance;
};

/** Where a detail sheet (ficha) gets its content from (brief §7). */
export type SheetSource =
  | { kind: "text" } // structured copy in the dictionary (entities.*)
  | { kind: "file"; url: string; format: "md" | "txt" } // prepared before serving; not used yet
  | { kind: "pdf"; url: string; summaryOnly: true }; // link to original + dictionary summary

export type Workshop = {
  id: string;
  /** Proper title as printed on the poster; not translated. */
  title: string;
  personIds: string[];
  /** One media id per poster. Empty array => colour surface. */
  posterMediaIds: string[];
  fallbackSurface: SurfaceToken;
  sheet: SheetSource | null;
  status: EditorialStatus;
  provenance: Provenance;
};

export type ProgramDay = {
  id: string;
  order: number;
  /** ISO date or null while unconfirmed. */
  date: string | null;
  venue: string | null;
  /** Time ranges as printed, e.g. "16:30–20:30". Empty while unknown. */
  hours: string[];
  sessionIds: string[];
  status: EditorialStatus;
  provenance: Provenance;
};

export type Session = {
  id: string;
  order: number;
  time: string | null;
  kind: "block" | "workshop" | "experience" | "break";
  workshopId: string | null;
  experienceId: string | null;
  status: EditorialStatus;
};

export type Experience = {
  id: string;
  personIds: string[];
  mediaId: string | null;
  fallbackSurface: SurfaceToken;
  relatedWorkshopIds: string[];
  sheet: SheetSource | null;
  status: EditorialStatus;
};

export type Resource = {
  id: string;
  format: "pdf" | "link" | "doc" | "html";
  url: string | null;
  language: string;
  relatedWorkshopIds: string[];
  relatedExperienceIds: string[];
  status: EditorialStatus;
};

export type Organization = {
  id: string;
  name: string;
  relation: "organiza" | "colabora";
  url: string | null;
  /** Media id of the logotype once supplied; null renders the name in type. */
  logoMediaId: string | null;
  status: EditorialStatus;
  provenance: Provenance;
};
