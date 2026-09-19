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
 * from the component's defaults. `palette` names one of `palettes`: "cicada" is the promoter's choice (the tree of the
 * reference: first in its lilac and cream, now from near white to the site's olive); "sepia" is the site's own warm palette, one word away.
 */
const treePalettes = {
  cicada: {
    /**
     * ORIGINAL COLOUR OF THE LEAVES (JIA-2026-09-19-35), kept here on the promoter's wish: the soft lilac / purple of
     * the «Cicada» reference, from a rosy cream in the light to lilac in the shade. To bring it back, put this line in
     * place of `leaves` below and un-comment the three tokens in app/theme/palette.css:
     *   leaves: ["var(--jia-tree-cream)", "var(--jia-tree-rose)", "var(--jia-tree-lilac)", "var(--jia-tree-lilac-deep)"],
     *   (#f6ece4 → #e6d2d8 → #c0b3da → #9286b8; the light's bounce was "var(--jia-tree-rose)")
     * Since JIA-2026-09-19-38 the crown runs from the near white it has on top to the site's dry olive, #72715b.
     */
    leaves: [
      "var(--jia-tree-cream)",
      "color-mix(in srgb, var(--jia-tree-cream) 58%, var(--jia-olive))",
      "color-mix(in srgb, var(--jia-tree-cream) 24%, var(--jia-olive))",
      "var(--jia-olive)",
    ],
    trunk: "var(--jia-tree-bark)",
    trunkDark: "var(--jia-tree-bark-deep)",
    /** The rocks are the site's own ochres and browns (JIA-2026-09-19-36); the shade under them, its ink. */
    ground: "color-mix(in srgb, var(--jia-copper) 50%, var(--jia-dune-light))",
    groundDark: "color-mix(in srgb, var(--jia-copper) 45%, var(--jia-terracotta-deep))",
    /** No green on them (JIA-2026-09-19-37): the faces the sun reaches are a sandy ochre, the knoll a dune ochre; the sides run from copper to a deep brown. */
    moss: "color-mix(in srgb, var(--jia-sand-deep) 82%, var(--jia-copper))",
    mossDark: "color-mix(in srgb, var(--jia-dune) 55%, var(--jia-copper))",
    shadow: "var(--jia-ink)",
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
  /** With the column moved left (JIA-2026-09-19-36) the crown clears every text from here up; narrower, the tree would be mostly off the window. */
  media: "(min-width: 1440px)",
  seed: 7,
  palette: treePalettes[treePalette],
  options: {
    /** The light of the reference: from above and the right, cream; the paper all around sends a warm bounce back. */
    light: { sky: "var(--jia-tree-cream)", bounce: "var(--jia-dune-light)", sun: "var(--jia-ivory)", skyIntensity: 2.1, sunIntensity: 1.6, sunFrom: [4, 5, 3] as [number, number, number] },
    /** Room on the left of the box for the leaves the breeze takes (they go down and to the left). */
    /** Its best side for this place: the crown leans towards the window's edge, away from the text. */
    shape: { turnDeg: 180 },
    /**
     * Set back into the page (JIA-2026-09-19-38). A bigger tree further away draws the same picture, so the depth is
     * in the cues: an open angle from a little higher (near lobes larger than far ones, the floor seen going away),
     * a veil of the section's paper over the far side, leaves that leave the crown and come towards the eye growing
     * as they come (the breeze has a z), and a shade drawn out towards us along the floor.
     */
    camera: { fovDeg: 36, elevationDeg: 9, air: { left: 0.5, right: 0, top: 0, bottom: 0 } },
    haze: { color: "var(--jia-vellum-3)", amount: 0.3 },
    /** Near white on top, olive below: height counts for the tone as much as the side the sun is on. */
    leaves: { heightTone: 0.5, depthShade: 0.16 },
    fall: { direction: [-0.75, -0.5, 1] as [number, number, number], distance: 6.5 },
    /** A shade that shows under the rocks: wide, deep towards the eye, with a dark core. */
    shadow: { opacity: 0.4, radius: 2.4, stretch: 1.15, depth: 1.9, core: { scale: 0.66, opacity: 0.5 } },
  },
};
