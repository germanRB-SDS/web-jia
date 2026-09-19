/**
 * Everything the SITE decides about the tree (the component decides nothing): whether it is there, from which window
 * width it is mounted, its colours — the site's own tokens, never literals here — and the options it changes from
 * the component's defaults. These are the validated values of the project the tree was built for; rename the tokens
 * to your palette (see palette-tokens.css) and keep the numbers as a starting point.
 */
const palettes = {
  /** Final look: near white on top of the crown, the brand's dry olive below; rocks in ochres and browns. */
  olive: {
    leaves: [
      "var(--tree-cream)",
      "color-mix(in srgb, var(--tree-cream) 58%, var(--brand-olive))",
      "color-mix(in srgb, var(--tree-cream) 24%, var(--brand-olive))",
      "var(--brand-olive)",
    ],
    trunk: "var(--tree-bark)",
    trunkDark: "var(--tree-bark-deep)",
    // `ground` is the rock; `moss` is whatever covers the faces that look at the sky and the knoll at the foot. Here:
    // no green at all — sandy ochre tops, copper sides, brown undersides.
    ground: "color-mix(in srgb, var(--brand-copper) 50%, var(--brand-dune-light))",
    groundDark: "color-mix(in srgb, var(--brand-copper) 45%, var(--brand-terracotta-deep))",
    moss: "color-mix(in srgb, var(--brand-sand-deep) 82%, var(--brand-copper))",
    mossDark: "color-mix(in srgb, var(--brand-dune) 55%, var(--brand-copper))",
    shadow: "var(--brand-ink)",
  },
  /** Original look: the soft lilac of the reference the tree was modelled on, rosy cream in the light → lilac in the shade. */
  lilac: {
    leaves: ["var(--tree-cream)", "var(--tree-rose)", "var(--tree-lilac)", "var(--tree-lilac-deep)"],
    trunk: "var(--tree-bark)",
    trunkDark: "var(--tree-bark-deep)",
    ground: "var(--tree-rock)",
    groundDark: "var(--tree-rock-deep)",
    moss: "var(--tree-moss)",
    mossDark: "var(--tree-moss-deep)",
    shadow: "var(--tree-shadow)",
  },
};

export const treeBackdrop = {
  enabled: true,
  /** Narrower than this the tree would be mostly off the window: it is not even mounted. */
  media: "(min-width: 1440px)",
  seed: 7,
  palette: palettes.olive,
  options: {
    /** Light from above and the right; the page all around sends a warm bounce back (use a rosy bounce with `lilac`). */
    light: { sky: "var(--tree-cream)", bounce: "var(--brand-dune-light)", sun: "var(--brand-ivory)", skyIntensity: 2.1, sunIntensity: 1.6, sunFrom: [4, 5, 3] as [number, number, number] },
    /** Its best side for a tree standing by the RIGHT edge: the crown leans to the edge, away from the text. */
    shape: { turnDeg: 180 },
    /** Set back into the page: an open angle from a little higher, a veil of the section's ground, leaves that come
        towards the eye growing as they come, a shade drawn out towards the viewer. `air.left` is the room the
        falling leaves need inside the canvas (they go down and to the left). */
    camera: { fovDeg: 36, elevationDeg: 9, air: { left: 0.5, right: 0, top: 0, bottom: 0 } },
    haze: { color: "var(--section-ground)", amount: 0.3 },
    fall: { direction: [-0.75, -0.5, 1] as [number, number, number], distance: 6.5 },
    leaves: { heightTone: 0.5, depthShade: 0.16 },
    shadow: { opacity: 0.4, radius: 2.4, stretch: 1.15, depth: 1.9, core: { scale: 0.66, opacity: 0.5 } },
  },
};

export type TreeBackdropConfig = typeof treeBackdrop;
