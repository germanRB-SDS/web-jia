# tree-3d — Audit of the origin implementation

What was used, where, and why, in the project the tree was built for (a Next.js 16 / React 19 / TypeScript 5.9
static site with a warm sepia palette, 2026-09-19). Five iterations by the promoter's feedback: first tree → twice
the size, reference colours, falling leaves, rocky ground, no growth → down to the floor, shade, ochre rocks, text
column moved → no green on the rocks → set back in depth, leaves from near white to olive.

## 1 · Files

| # | Origin file | Role | In this package |
|---|---|---|---|
| 1 | `components/tree-3d/Tree3D.tsx` | React wrapper: host `div`, dynamic `import()` of the engine, `ResizeObserver`, cleanup; props by content, not identity | `component/` |
| 2 | `components/tree-3d/tree-scene.ts` | Engine: own canvas, renderer, CSS-colour resolver, lights, haze, two-step ground shade, exact camera fit, visibility-driven loop, dispose | `component/` |
| 3 | `components/tree-3d/tree-builder.ts` | Pure geometry from a seed: stems and branches (tapering tubes, carried frames), hanging roots, leaves on the skin of lobes, knoll, flat-faced rocks, falling-leaf starts | `component/` |
| 4 | `components/tree-3d/wind.ts` | `onBeforeCompile` patches: shared sway, leaf flutter and opening, lobe normals, falling-leaf flight | `component/` |
| 5 | `components/tree-3d/config.ts` | `TREE_DEFAULTS`, `TREE_DEFAULT_PALETTE` (neutral green tree), types, `mergeOptions` | `component/` |
| 6 | `components/tree-3d/Tree3D.module.css` | `pointer-events: none; user-select: none; overflow: hidden` | `component/` |
| 7 | `components/tree-3d/index.ts` | Public exports | `component/` |
| 8 | `components/tree-3d/README.md` | Component readme (Spanish) | folded into `INDEX-AND-HOW-TO-USE-THEM.md` |
| 9 | `components/site/ExperiencesTree.tsx` | Site bridge: `matchMedia` gate + props | `integration/react-next/BackdropTree.tsx` |
| 10 | `components/site/Experiences.tsx` | Mounts the bridge inside the section's backdrop, after the photograph | described in the how-to (step 4) |
| 11 | `components/site/Experiences.module.css` | `.tree` box; tree excluded from the "every child but the photo" spacing rule; content column moved 5 % left (`--aula-shift`) | `integration/react-next/backdrop-tree.module.css` |
| 12 | `lib/content/sections/experiencias.ts` | Site config: enabled, media, seed, palettes, options | `integration/react-next/tree.config.ts` |
| 13 | `lib/content/assemble.ts` | Page model: `tree: typeof config \| null` | one line; project-specific |
| 14 | `app/theme/palette.css` | Tree-only tokens (the site allows no colour literal outside this file) | `integration/react-next/palette-tokens.css` |
| — | new in this package | `component/mount-tree.ts`, `vanilla/` | React-free entry and no-build demo |

Dependencies actually used: `three@^0.186` (`WebGLRenderer`, `InstancedMesh`, `MeshLambertMaterial`, `Fog`,
`CatmullRomCurve3`, `IcosahedronGeometry`, `SphereGeometry`, `CanvasTexture`…), `react@19` (wrapper only). **Not used:**
GSAP (the project has it), GLB/Blender, textures, shadow maps, post-processing, environment maps.

## 2 · Colour constants

Tree-only tokens added to the site's palette:

| Token | Value | Use |
|---|---|---|
| `--<site>-tree-cream` → `--tree-cream` | `#f6ece4` | light on the crown; first leaf tone; sky light |
| `--<site>-tree-bark` → `--tree-bark` | `#a9837a` | bark |
| `--<site>-tree-bark-deep` → `--tree-bark-deep` | `#5e4552` | bark, grooves |
| `--tree-rose` / `--tree-lilac` / `--tree-lilac-deep` | `#e6d2d8` / `#c0b3da` / `#9286b8` | **original** leaf tones (kept commented) |
| `--tree-rock` / `--tree-rock-deep` | `#d8d2e3` / `#9d96b4` | original grey-lilac rocks (removed from the site) |
| `--tree-moss` / `--tree-moss-deep` | `#d2cc7c` / `#929755` | original yellow-green moss (removed) |
| `--tree-shadow` | `#6d6390` | original lilac shade (removed) |

Brand tokens the final look points at: olive `#72715b`, copper `#ad754d`, dune `#c0ac94`, dune-light `#ddccb5`,
sand-deep `#e2cfb2`, terracotta-deep `#703923`, ink `#2f180b`, ivory `#f6eedf`, section ground (vellum) `#efe5d6`.

Final mixes: leaves `cream` → `mix(cream 58 %, olive)` → `mix(cream 24 %, olive)` → `olive`; rock `mix(copper 50 %,
dune-light)`; rock dark `mix(copper 45 %, terracotta-deep)`; sunlit faces `mix(sand-deep 82 %, copper)`; knoll
`mix(dune 55 %, copper)`; shade `ink`; sky `cream`, bounce `dune-light`, sun `ivory`; haze = section ground.
Component defaults are a plain green tree on grey rocks: no site colour lives in the component.

## 3 · Site options over the defaults

`light { skyIntensity 2.1, sunIntensity 1.6, sunFrom [4,5,3] }` · `shape.turnDeg 180` · `camera { fovDeg 36,
elevationDeg 9, air.left 0.5 }` · `haze { amount 0.3 }` · `fall { direction [-0.75,-0.5,1], distance 6.5 }` ·
`leaves { heightTone 0.5, depthShade 0.16 }` · `shadow { opacity 0.4, radius 2.4, stretch 1.15, depth 1.9, core { scale
0.66, opacity 0.5 } }` · `seed 7` · mount from `1440px`.

Box: `height 108 %`, `bottom −5.6 %`, `aspect-ratio 1.45`, `right calc(margin − 34.2vw)`; section `overflow: clip`.

## 4 · Decisions that cost iterations (keep them)

1. **Procedural, not the reference's video.** The reference tree is a third-party pre-rendered video: not used.
2. **Leaves on the skin of lobes**, tips out and drooping, lit by the lobe's normal (not their own): that is what
   makes the crown read as masses instead of confetti. Both faces keep that normal (the back-face flip is undone).
3. **Tone = side of the sun + facing the sun + height in the crown** (`heightTone`), plus depth shading inside and
   under each lobe. Tone scatter above ~3 % brings the speckles back.
4. **The ground shade's halo must not enter the camera fit**: it widened the box and shrank the tree.
5. **Exact fit by projection** (measure the 8 corners in NDC, correct, repeat): the closed-form fit was only good
   for a long lens.
6. **Depth**: moving the tree back and scaling it up is a no-op in perspective; the cues are listed in the how-to.
7. **Text wins**: tie the tree to the content column, turn it so the crown leans to the window's edge, gate the
   mount by width. With the column moved 5 % left the tree could be mounted from 1440 px instead of 1680.
8. The engine **owns its canvas** (created and removed with the scene) so `forceContextLoss()` is safe under React
   Strict Mode's double mount.
9. `alphaMap` reads the **green channel**: the shade's gradient is opaque greys on black, not white with alpha.
10. CSS colours are resolved through `getComputedStyle` + a 1 px 2D canvas, so `var()` and `color-mix()` work and
    the result is converted from sRGB to the renderer's linear space.

## 5 · Discarded

Single straight trunk; smooth earth mound with pebbles; copper/olive confetti crown; growth animation on entering
the screen; leaves falling in the wall's plane only; long-lens camera (22°); lilac crown and mossy grey rocks (kept
as the `lilac` palette); mounting below 1440 px (crown over the cards' titles, or tree mostly off the window).
