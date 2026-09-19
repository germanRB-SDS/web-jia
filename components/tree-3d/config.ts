/**
 * Tree 3D — the defaults of the procedural tree. Nothing here belongs to a site: the palette is a plain green tree
 * and the measures are the tree's own units (1 ≈ a metre, y up). Whoever uses the component passes its own palette
 * and the options it wants to change (`<Tree3D palette={…} options={…} />`); everything else falls back to this.
 */

/** Any CSS colour, or a custom property of the page: "var(--brand-green)". Resolved on the component's element. */
export type CssColor = string;

export type TreePalette = {
  /** Two to four tones the foliage runs through, from the lit side of the crown to the far one. */
  leaves: CssColor[];
  trunk: CssColor;
  trunkDark: CssColor;
  ground: CssColor;
  groundDark: CssColor;
  /** The contact shadow under the mound. */
  shadow: CssColor;
};

export const TREE_DEFAULT_PALETTE: TreePalette = {
  leaves: ["#8fae5d", "#5f8a3c", "#3f6b33"],
  trunk: "#6b4a33",
  trunkDark: "#3d2a1d",
  ground: "#8a6b4a",
  groundDark: "#5c4430",
  shadow: "#1d140d",
};

export const TREE_DEFAULTS = {
  shape: {
    /** The trunk up to its first fork, its radius at the foot, and how much it leans and wanders. */
    trunk: { height: 1.35, radius: 0.13, lean: 0.3, wander: 0.34 },
    /** One entry per level of branches above the trunk: how many children, and how far they open (degrees). */
    levels: [
      { children: 3, spreadDeg: 30 },
      { children: 3, spreadDeg: 42 },
      { children: 2, spreadDeg: 50 },
      { children: 2, spreadDeg: 56 },
    ],
    /** Each child against its parent. */
    lengthRatio: 0.74,
    radiusRatio: 0.66,
    /** Pull of every branch towards the sky (0: none). */
    upward: 0.32,
    /** How much a branch wanders along its way. */
    wander: 0.42,
    /** Sides of the tubes: the trunk, and the thinnest twigs. */
    radialSegments: { trunk: 10, twig: 5 },
    /** The whole tree turned about its vertical axis (degrees): pick its best side. */
    turnDeg: 0,
  },
  leaves: {
    /** Instances of one small leaf, in one draw call. */
    count: 12000,
    size: 0.08,
    /** Share of the size a leaf may lose or gain. */
    sizeJitter: 0.45,
    /** Radius of the mass of leaves around each branch tip, and how flat it is (1: a ball). */
    clusterRadius: 0.56,
    clusterFlatten: 0.8,
    /** How much the inside of the crown darkens (0: not at all). */
    depthShade: 0.3,
    /** How much each leaf's normal gives way to the crown's (0: flat cards, 1: a smooth ball of foliage). */
    normalBlend: 0.9,
    /** Share of leaves that ignore the tone of their mass. */
    toneScatter: 0.16,
  },
  mound: { radius: 1.05, height: 0.24, roughness: 0.2, pebbles: 9, segments: 48 },
  wind: {
    /** Overall strength: 0 stills the tree. */
    strength: 1,
    /** The crown's slow sway (units at the top of the tree) and each leaf's flutter (share of its length). */
    sway: 0.055,
    flutter: 0.34,
    flutterSpeed: 2.1,
  },
  /** Once, the first time the tree is seen: it rises from the ground and the leaves open from the inside out. */
  grow: { enabled: true, ms: 1600 },
  camera: {
    fovDeg: 22,
    /** The eye above the horizon (degrees): enough to see the top of the mound. */
    elevationDeg: 7,
    /** Air around the tree, as a share of its box. */
    padding: 0.04,
  },
  light: {
    sky: "#fff6e6" as CssColor,
    bounce: "#9a8a76" as CssColor,
    sun: "#fff1dc" as CssColor,
    skyIntensity: 1.7,
    sunIntensity: 1.9,
    /** Where the sun stands, from the tree. */
    sunFrom: [-3, 5, 4] as [number, number, number],
  },
  shadow: { opacity: 0.26, radius: 1.45, stretch: 1.3 },
  render: { maxPixelRatio: 2, maxFps: 0 },
};

export type TreeOptions = typeof TREE_DEFAULTS;

export type DeepPartial<T> = T extends (infer U)[] ? U[] : T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

/** `over` laid on `base`: objects merge key by key, arrays and values are replaced whole. */
export function mergeOptions<T>(base: T, over?: DeepPartial<T>): T {
  if (!over) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(over as Record<string, unknown>)) {
    if (value === undefined) continue;
    const current = out[key];
    out[key] = value && typeof value === "object" && !Array.isArray(value) && current && typeof current === "object" && !Array.isArray(current) ? mergeOptions(current, value as DeepPartial<typeof current>) : value;
  }
  return out as T;
}
