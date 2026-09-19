# Midu GTA VI Hero — External Reference Notes

Source code URL: https://github.com/midudev/landing-gta-vi

Author/source context: public educational repository by midudev for a GTA VI-inspired landing hero.
Observed source state: `main`, tree SHA `57abb33c6182429e1e7934a3ecd38229c133e4de`, checked 2026-07-10.

## License And Copying Policy

Do not vendor this source code or its assets into `sds-dev-governance`.

It is fine to inspect the repository, clone it into a temporary local directory, run it locally and
study how the landing works. The restriction is about shipping/copying the upstream code or GTA
brand material inside SDS projects.

Findings:

- The repository is public and educational.
- No `LICENSE` file was found at the time of review, so SDS should not store a copy of the code.
- The sample contains GTA-themed brand assets, fonts, logos and imagery. Treat those as reference
  material for local study only, not reusable SDS assets.
- This folder is therefore a reference index and learning note, not a copied project snapshot.
- If a future project needs the effect, implement a clean-room version using original assets,
  project-owned copy and project-owned branding.

## Technical Findings

The repository is a compact Astro landing page:

- Framework: Astro.
- Styling stack: Tailwind CSS v4.
- Animation dependency: GSAP.
- Main implementation surface: `src/pages/index.astro`.
- Global shell/layout: `src/layouts/Layout.astro`.
- Visual assets: WebP hero/background/logo assets, SVG logos/icons and custom WOFF fonts.

The hero pattern is valuable because it demonstrates a full-viewport, brand-led composition where
the first viewport is carried by real visual media rather than a decorative gradient or card layout.

Reusable ideas to internalize:

- Treat the hero as a layered scene: background key art, foreground logo/mark, CTA, platform/support
  details and scroll affordance.
- Keep the brand/object as the dominant first-viewport signal.
- Use real bitmap imagery for the primary scene, then animate transforms/opacity around it.
- Animate with a timeline mindset: entrance state, revealed state, scroll/continuation state.
- Keep layout primitives simple; reserve JS animation for sequencing and motion, not for basic
  document structure.
- Separate the portable pattern from the GTA-specific assets and names.

## SDS Use

Use this reference only when a project asks for a cinematic, media-led landing hero or game/product
announcement style.

Before implementing from it:

1. Read `INDEX-AND-HOW-TO-USE-THEM.md` in this folder.
2. Inspect the upstream repo at the current commit or branch.
3. Record the upstream commit/tree SHA used for analysis.
4. Extract the pattern into a project-specific design brief.
5. Rebuild with original assets and the local stack.
6. Verify the result with screenshots/mobile checks and, for animated canvases/scenes, pixel checks.

## Local Evaluation Protocol

When the goal is to see whether the upstream sample works as claimed, clone it outside
`sds-dev-governance`, for example under `/tmp` or another scratch directory, and run it as an
external reference project:

```bash
git clone https://github.com/midudev/landing-gta-vi.git /tmp/midu-gta-vi-hero
cd /tmp/midu-gta-vi-hero
pnpm install
pnpm dev
```

Do not commit that clone, its dependencies, generated output or copied assets into this repo.

## Current Recommendation

Leave the upstream code outside the SDS repo for now. Keep this resource as an analysis pointer until
a concrete project needs the pattern. At that point, analyze the upstream code and produce a
clean-room implementation adapted to the target project's stack, governance and asset ownership.
