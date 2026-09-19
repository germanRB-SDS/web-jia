import type { SurfaceToken } from "../data/types";

/**
 * Set `showDemo` to false to hide demo entries and show the pending state instead. The section's ground is a
 * full-bleed photograph (`mediaId`) whose clear left half carries the text; with no media it is plain vellum.
 */
export const experienciasConfig = {
  id: "experiencias",
  showDemo: true,
  mediaId: "experiencias-aula" as string | null,
  fallbackSurface: "card" as SurfaceToken,
} as const;

/**
 * The tree of knowledge behind the section's content, by the window's right edge (JIA-2026-09-19-34 and -35). The
 * tree itself is the portable component `components/tree-3d/`; this is everything the site decides about it: whether
 * it is there, from which window width it is mounted, its colours — palette tokens only — and the options it changes
 * from the component's defaults. `palette` names one of `palettes`: "cicada" is the promoter's choice (the lilac and
 * cream of the reference, tokens --jia-tree-*); "sepia" is the site's own warm palette, one word away.
 */
const treePalettes = {
  cicada: {
    leaves: ["var(--jia-tree-cream)", "var(--jia-tree-rose)", "var(--jia-tree-lilac)", "var(--jia-tree-lilac-deep)"],
    trunk: "var(--jia-tree-bark)",
    trunkDark: "var(--jia-tree-bark-deep)",
    ground: "var(--jia-tree-rock)",
    groundDark: "var(--jia-tree-rock-deep)",
    moss: "var(--jia-tree-moss)",
    mossDark: "var(--jia-tree-moss-deep)",
    shadow: "var(--jia-tree-shadow)",
  },
  sepia: {
    leaves: ["var(--jia-ivory)", "var(--jia-dune-light)", "var(--jia-copper)", "var(--jia-olive)"],
    trunk: "color-mix(in srgb, var(--jia-terracotta-deep) 70%, var(--jia-ink))",
    trunkDark: "var(--jia-ink)",
    ground: "var(--jia-dune)",
    groundDark: "color-mix(in srgb, var(--jia-copper) 70%, var(--jia-terracotta-deep))",
    moss: "var(--jia-olive)",
    mossDark: "color-mix(in srgb, var(--jia-olive) 70%, var(--jia-ink))",
    shadow: "var(--jia-ink)",
  },
};

const treePalette: keyof typeof treePalettes = "cicada";

export const experienciasTree = {
  enabled: true,
  /** Narrower than this the column reaches so far right that the crown would sit on the cards' titles. */
  media: "(min-width: 1680px)",
  seed: 7,
  palette: treePalettes[treePalette],
  options: {
    /** The light of the reference: from above and the right, cream; the shade comes back lilac. */
    light: { sky: "var(--jia-tree-cream)", bounce: "var(--jia-tree-rose)", sun: "var(--jia-ivory)", skyIntensity: 2.1, sunIntensity: 1.6, sunFrom: [4, 5, 3] as [number, number, number] },
    /** Room on the left of the box for the leaves the breeze takes (they go down and to the left). */
    /** Its best side for this place: the crown leans towards the window's edge, away from the text. */
    shape: { turnDeg: 180 },
    camera: { air: { left: 0.5, right: 0, top: 0, bottom: 0 } },
  },
};
