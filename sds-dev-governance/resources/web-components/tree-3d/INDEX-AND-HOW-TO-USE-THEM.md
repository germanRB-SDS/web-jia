# tree-3d — Index and How to Use It

A procedural, animated 3D tree drawn in real time with Three.js on a transparent canvas: a few slender stems, a
dense crown of rounded lobes of leaves, thin roots hanging from it, piled flat-faced rocks at its foot. A breeze sways
it and tears leaves off, which drift towards the viewer and fade. Built as **decoration behind a section's content**.
No model file, no video, no GSAP: everything is generated from a seed. Validated in production-like conditions in a
Next.js 16 / React 19 site (2026-09-19); the no-build HTML demo in `vanilla/` was rendered and checked too.

Discovery aliases: `tree-3d`, `arbol 3d`, `árbol del saber`, `procedural tree`, `animated tree background`,
`three.js tree`, `falling leaves`, `hojas que caen`, `cicada tree`.

Previews: `preview/vanilla-demo-1600.jpg` (final olive look, no-build demo), `preview/behind-content-section-1920.jpg`
(integrated behind a section), `preview/original-lilac-look-detail.jpg` (original lilac look, before the ochre rocks).

## Use when

- a section has free room by one edge and wants a living, quiet backdrop that belongs to the page's palette;
- the project already ships, or accepts, `three` (the engine is loaded on demand, never on the critical path);
- the decoration may disappear on small screens without loss (it is not mounted there at all).

Do not use it as content, as a hero's only message, on pages with another heavy WebGL scene in the same viewport, or
where the design needs the exact look of a pre-rendered video: this is a real-time, flat-leaf tree.

## What is in this folder

| Path | What it is | Needed for |
|---|---|---|
| `component/` | **The component. Copy this folder as it is.** `Tree3D.tsx` (React wrapper), `mount-tree.ts` (same thing without React), `tree-scene.ts` (engine: renderer, exact camera fit, lights, haze, shade, loop, CSS-colour resolution, dispose), `tree-builder.ts` (pure procedural geometry), `wind.ts` (shader patches: sway, flutter, lobe normals, falling leaves), `config.ts` (defaults, palette type, deep merge), `Tree3D.module.css`, `index.ts` | every integration |
| `integration/react-next/` | The site side, as validated: `BackdropTree.tsx` (media-query gate), `tree.config.ts` (palettes `olive`/`lilac`, all tuned options), `backdrop-tree.module.css` (layer order, the tree's box), `palette-tokens.css` (the few tokens a brand palette lacks; the lilac originals are kept, commented) | React / Next.js |
| `vanilla/` | No framework, no build: `index.html` (import map for `three`, palette switch), `tree3d-demo.css`, `js/*.js` (the engine compiled to browser ES modules) | plain HTML/CSS/JS, or a quick look |
| `AUDIT.md` | Everything that was used to build it in the origin project, file by file, every colour constant, every decision and what was discarded | understanding, not integrating |
| `preview/` | Three reference captures | acceptance by eye |

Dependencies: `three` (validated with 0.186; needs WebGL 2) and, for the React wrapper only, `react` ≥ 18. Inside
`component/` nothing else is imported: no project code, no CSS of any site, no assets.

## Agent procedure — integrate it into a project

1. **Read the target project first**: framework, where reusable components live, its palette/tokens file, the section
   that will carry the tree and its layer structure, the content column's max width. Apply the project's own rules
   about colours and copy (the tree has no copy).
2. **Copy `component/`** to the project's components folder as `tree-3d/`, unchanged. Add `three` (and
   `@types/three` in TypeScript) if missing. Drop `Tree3D.tsx`/`index.ts` in a non-React project; drop `mount-tree.ts`
   in a React one if unused.
3. **Colours: map, do not paste.** Take `integration/react-next/tree.config.ts` and point every `var(--brand-*)` at
   the project's real tokens (olive, copper, dune, ink… or their closest roles). Add only the tokens of
   `palette-tokens.css` the palette truly lacks, in the project's palette file. The component resolves any CSS colour
   (`var()`, `color-mix()`, literals) against its own element, so the site never needs literals outside its palette.
4. **Mount it as a layer**: inside the section, after its ground/photograph and before its content; content at
   `z-index: 1`, tree at `0`, section `position: relative; overflow: clip`. Use `backdrop-tree.module.css`. If the
   section has a rule that spaces "every child that is not the photograph", exclude the tree from it.
5. **Size by the section's height, place by the content column**: `height: 108%`, `bottom: -5.6%`,
   `aspect-ratio: 1.45`, `right: calc((100vw - var(--container)) / 2 - 34.2vw)`. Then look at it and correct: **text
   wins** — no running text or card title may sit on the crown. Move the tree, turn it (`shape.turnDeg`), or raise
   the mount width; never accept unreadable text.
6. **Gate the mount** with a media query (`BackdropTree.tsx`): below it, mount nothing (no WebGL context).
7. **Verify** (acceptance below) in a real browser at the project's main widths, then record the decision in the
   project's own prompts/reports.

Plain HTML: serve `vanilla/` and open `index.html`; to use it in a page, keep `js/`, the import map and the
`mountTree(host, { palette, options, seed })` call. Regenerate `js/` after editing the sources with:
`tsc --target ES2022 --module ESNext --moduleResolution bundler component/{config,tree-builder,tree-scene,wind,mount-tree}.ts --outDir vanilla/js`,
then add `.js` to the relative imports (browsers do not resolve extensionless specifiers).

## Behaviour contract

- **Whole from the first frame.** Growing from the ground exists (`grow.enabled`) and is off.
- **Wind in the vertex shader**: one sway shared by wood and leaves (a leaf never leaves its twig), a flutter per leaf
  in gusts; **falling leaves** are a second instanced mesh placed by the shader alone (start where a crown leaf is, let
  go slowly, gather speed along `fall.direction`, weave, tumble, fade before landing). Zero per-frame CPU work.
- **Depth is cues, not a coordinate**: a bigger tree further away draws the same picture. What sets it back: an open
  angle from a little higher (`camera.fovDeg` 36, `elevationDeg` 9), `haze` of the section's ground, leaves with +z in
  their direction (they grow as they come), a shade drawn out towards the viewer (`shadow.depth`).
- **Cost**: leaves are one `InstancedMesh` (22 000 by default), no shadow map, no post-processing, DPR ≤ 2; it draws
  only while on screen and with the tab visible. Levers: `leaves.count`, `render.maxPixelRatio`, `render.maxFps`.
- **Reduced motion**: one still frame, no loop, no falling leaf. **No WebGL 2**: nothing drawn, no error.
- **Accessibility**: pure decoration — `aria-hidden`, no focus, `pointer-events: none`.
- The camera fits the tree's box by real projection (iterative), standing on the box's floor, with `camera.air` extra
  room per side. **Never let the ground shade's halo into the fit** (only its core counts): it widens the box and the
  tree shrinks.

## Acceptance

- [ ] Only `react`/`three`/relative imports inside `tree-3d/` (`grep -rho 'from "[^"]*"' tree-3d | sort | uniq -c`).
- [ ] Every colour reaches the tree from the project's palette file; no literal outside it.
- [ ] No text under the crown at each supported width; below the mount width no `<canvas>` exists.
- [ ] `document.documentElement.scrollWidth === clientWidth` (the box may overhang: the section must clip it).
- [ ] Reduced motion: still tree, no leaf in the air. Tab hidden / off screen: no frames.
- [ ] Type-check and production build pass; console free of errors.

Headless screenshots of WebGL need `--use-angle=swiftshader --enable-unsafe-swiftshader`; frame times measured that
way say nothing about real GPUs.

## Provenance and limits

Modelled after the look of the tree in Zajno's "Cicada" CodePen, where the tree is a **pre-rendered third-party
video**: that video is neither used nor linked here; nothing was copied from that pen. This tree is original code.
Reference, not runtime source of truth: once copied into a project it belongs to that project.
