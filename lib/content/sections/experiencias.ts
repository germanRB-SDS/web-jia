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
 * The tree of knowledge behind the section's content, by the window's right margin (JIA-2026-09-19-34). The tree
 * itself is the portable component `components/tree-3d/`; this is everything the site decides about it: whether it
 * is there, from which window width it is mounted (where the margin beside the container can hold it: narrower, its
 * crown would sit behind the cards' titles), its colours — palette tokens only — and the options it changes from the component's defaults.
 */
export const experienciasTree = {
  enabled: true,
  media: "(min-width: 1680px)",
  seed: 7,
  palette: {
    leaves: ["var(--jia-ivory)", "var(--jia-dune-light)", "var(--jia-copper)", "var(--jia-olive)"],
    trunk: "color-mix(in srgb, var(--jia-terracotta-deep) 70%, var(--jia-ink))",
    trunkDark: "var(--jia-ink)",
    ground: "var(--jia-dune)",
    groundDark: "color-mix(in srgb, var(--jia-copper) 70%, var(--jia-terracotta-deep))",
    shadow: "var(--jia-ink)",
  },
  /** The light of the classroom photograph: warm, from the left; the paper all around bounces plenty back. */
  options: {
    light: { sky: "var(--jia-ivory)", bounce: "var(--jia-dune)", sun: "var(--jia-ivory)" },
  },
};
