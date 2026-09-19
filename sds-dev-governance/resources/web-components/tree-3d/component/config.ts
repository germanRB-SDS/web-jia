/**
 * Tree 3D — the defaults of the procedural tree. Nothing here belongs to a site: the palette is a plain green tree
 * and the measures are the tree's own units (1 ≈ a metre, y up). Whoever uses the component passes its own palette
 * and the options it wants to change (`<Tree3D palette={…} options={…} />`); everything else falls back to this.
 */

/** Any CSS colour, or a custom property of the page: "var(--brand-green)". Resolved on the component's element. */
export type CssColor = string;

export type TreePalette = {
  /** Two to four tones the foliage runs through, from the lit side of the crown to the shaded one. */
  leaves: CssColor[];
  trunk: CssColor;
  trunkDark: CssColor;
  /** The rocks the tree stands on. */
  ground: CssColor;
  groundDark: CssColor;
  /** What grows on them: the knoll at the foot of the trunk and the faces of the rocks that look at the sky. */
  moss: CssColor;
  mossDark: CssColor;
  /** The contact shadow under it all. */
  shadow: CssColor;
};

export const TREE_DEFAULT_PALETTE: TreePalette = {
  leaves: ["#a9c46c", "#7fa650", "#5a8640", "#3f6b33"],
  trunk: "#7a5a44",
  trunkDark: "#3d2a1d",
  ground: "#a9a59c",
  groundDark: "#6f6b64",
  moss: "#9aa84f",
  mossDark: "#5f7036",
  shadow: "#1d140d",
};

export const TREE_DEFAULTS = {
  shape: {
    /** Slender stems twisting up from one foot: how many, their height up to the first fork, their radius at the
        foot, how far they lean apart and how much they wander. */
    trunk: { stems: 3, height: 1.6, radius: 0.085, lean: 0.24, wander: 0.42 },
    /** One entry per level of branches above a stem: how many children, and how far they open (degrees). */
    levels: [
      { children: 2, spreadDeg: 34 },
      { children: 2, spreadDeg: 44 },
      { children: 2, spreadDeg: 52 },
    ],
    /** Each child against its parent. */
    lengthRatio: 0.74,
    radiusRatio: 0.66,
    /** Pull of every branch towards the sky (0: none). */
    upward: 0.3,
    /** How much a branch wanders along its way. */
    wander: 0.42,
    /** Sides of the tubes: the stems, and the thinnest twigs. */
    radialSegments: { trunk: 9, twig: 5 },
    /** Thin roots hanging from under the crown: how many, and how long (shortest, longest). */
    vines: { count: 9, length: [0.7, 1.7] as [number, number], radius: 0.012 },
    /** The whole tree turned about its vertical axis (degrees): pick its best side. */
    turnDeg: 0,
  },
  leaves: {
    /** Instances of one small leaf, in one draw call. */
    count: 22000,
    size: 0.15,
    /** Share of the size a leaf may lose or gain. */
    sizeJitter: 0.35,
    /** The foliage gathers in rounded lobes around the branch tips (and, larger, around the forks): the radius of
        a tip's lobe, how much larger a fork's is, and how flat they are (1: a ball). */
    lobeRadius: 0.74,
    forkLobe: 1.35,
    lobeFlatten: 0.86,
    /** Leaves lie on the skin of their lobe, overlapping like feathers: the skin starts at this share of the radius. */
    shell: 0.62,
    /** How far a leaf's tip hangs from pointing straight out of its lobe. */
    droop: 0.35,
    /** How much the inside and the underside of a lobe darken (0: not at all). */
    depthShade: 0.22,
    /** How much each leaf's normal gives way to its lobe's (0: flat cards, 1: smooth balls of foliage). */
    normalBlend: 0.88,
    /** How much the height in the crown moves a leaf along the run of tones: the top towards the first, the
        bottom towards the last (0: height does not count). */
    heightTone: 0.25,
    /** Share of leaves that ignore the tone of their lobe. */
    toneScatter: 0.03,
  },
  /** Where the tree stands: a mossy knoll at the foot of the stems, among piled, flat-faced rocks. */
  mound: { radius: 0.95, height: 0.3, roughness: 0.2, segments: 40, rocks: 18, rockReach: 1.7, rockSize: [0.2, 0.52] as [number, number], mossOnRocks: 0.55 },
  wind: {
    /** Overall strength: 0 stills the tree. */
    strength: 1,
    /** The crown's slow sway (share of the tree's height, at its top) and each leaf's flutter (share of its length). */
    sway: 0.03,
    flutter: 0.3,
    flutterSpeed: 2.1,
  },
  /** Leaves the breeze tears off the crown: they drift away along `direction`, tumbling, and fade before they land. */
  fall: {
    count: 120,
    /** Where the breeze takes them (x right, y up, z towards the eye). */
    direction: [-1, -0.62, 0.2] as [number, number, number],
    /** How far a leaf travels in its life, and how long that life is (seconds: shortest, longest). */
    distance: 3.8,
    seconds: [6, 11] as [number, number],
    /** Turns per second about itself, and how far it weaves off its path. */
    tumble: 0.45,
    drift: 0.22,
    /** Against the size of the leaves on the tree. */
    size: 1,
  },
  /** Air between the eye and the tree, off by default (`amount: 0`): everything is veiled a little by `color` (the
      page's ground), the far side of the tree more than the near one, up to `amount` (0–1). Distance, not fog. */
  haze: { color: "#ffffff" as CssColor, amount: 0 },
  /** Off by default: the tree is there, whole, from the first frame. On, it rises from the ground the first time it is seen. */
  grow: { enabled: false, ms: 1600 },
  camera: {
    fovDeg: 22,
    /** The eye above the horizon (degrees): enough to see the top of the rocks. */
    elevationDeg: 6,
    /** Air around the tree, as a share of its box. */
    padding: 0.03,
    /** More air on a side, as a share of the tree's own width or height: room for the falling leaves to fade in. */
    air: { left: 0, right: 0, top: 0, bottom: 0 },
  },
  light: {
    sky: "#fff6e6" as CssColor,
    bounce: "#9a8a76" as CssColor,
    sun: "#fff1dc" as CssColor,
    skyIntensity: 1.7,
    sunIntensity: 1.9,
    /** Where the sun stands, from the tree. The foliage's run of tones starts on this side. */
    sunFrom: [-3, 5, 4] as [number, number, number],
  },
  /** The shade on the ground, without a shadow map: a wide soft halo (its radius across, drawn out away from the
      sun by `stretch`, and `depth` times that towards the eye) and a darker core close under the rocks. */
  shadow: { opacity: 0.26, radius: 1.9, stretch: 1.25, depth: 0.8, core: { scale: 0.62, opacity: 0.3 } },
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
