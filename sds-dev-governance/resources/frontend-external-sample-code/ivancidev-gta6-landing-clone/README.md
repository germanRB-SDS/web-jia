# Ivancidev GTA6 Landing Clone — External Reference Notes

Source code URL: https://github.com/ivancidev/gta6-landing-clone
Live reference URL: https://gta6-landing-clone.vercel.app

Author/source context: public GTA VI landing-page clone by ivancidev.
Observed source state: `master`, commit SHA `679dfd8b74a35e064f94c44115ced98e4c6b4c3f`,
tree SHA `a9a6931aa41e8b043413900564850507e9227942`, checked 2026-07-10.
Observed deployment state: `curl -I -L --max-time 20 https://gta6-landing-clone.vercel.app`
returned HTTP 200 from Vercel on 2026-07-10; user also confirmed the site works in browser.

## License And Copying Policy

Do not vendor this source code or its assets into `sds-dev-governance`.

It is fine to inspect the repository, clone it into a temporary local directory, run it locally and
study how the landing works. The restriction is about shipping/copying the upstream code or GTA
brand material inside SDS projects.

Findings:

- The repository is public and linked to a working Vercel deployment.
- No `LICENSE` file was found at the time of review, so SDS should not store a copy of the code.
- The sample contains GTA/Rockstar-themed brand assets, fonts, logos and imagery. Treat those as
  reference material for local study only, not reusable SDS assets.
- This folder is therefore a reference index and learning note, not a copied project snapshot.
- If a future project needs the effect, implement a clean-room version using original assets,
  project-owned copy and project-owned branding.

## Technical Findings

The repository is a compact Astro landing clone:

- Framework: Astro.
- Component stack: React + TypeScript.
- Animation dependencies: GSAP and Lenis.
- Main page surface: `src/pages/index.astro`.
- Hero implementation surfaces: `src/components/Hero.astro`, `src/components/HeroAnimation.tsx`
  and `src/styles/hero.css`.
- Menu implementation surfaces: `src/components/Menu.astro`, `src/components/MenuAnimation.tsx`
  and `src/styles/menu.css`.
- Visual assets: PNG/WebP hero/background/logo assets, Rockstar/trailer SVGs and a custom OTF font.

The sample is valuable as a second online reference for the GTA VI page because it exposes both
source code and a deployed site that can be inspected visually before doing clean-room extraction.

Reusable ideas to internalize:

- Split the page into a hero scene and a menu/continuation layer rather than treating the hero as a
  static banner.
- Use framework-native islands/components for animation surfaces while keeping the route simple.
- Pair GSAP sequencing with smooth-scroll behavior when the experience depends on cinematic motion.
- Keep responsive behavior explicit because the visual composition depends on large image assets.
- Use the live deployment to compare source intent against runtime behavior before adapting the
  pattern.

## SDS Use

Use this reference only when a project asks for a cinematic, media-led landing hero or game/product
announcement style.

Before implementing from it:

1. Read `INDEX-AND-HOW-TO-USE-THEM.md` in this folder.
2. Inspect the upstream repo at the current commit or branch.
3. Check the live deployment, if still available.
4. Record the upstream commit/tree SHA and deployment status used for analysis.
5. Extract the pattern into a project-specific design brief.
6. Rebuild with original assets and the local stack.
7. Verify the result with screenshots/mobile checks and, for animated canvases/scenes, pixel checks.

## Local Evaluation Protocol

When the goal is to see whether the upstream sample works as claimed, clone it outside
`sds-dev-governance`, for example under `/tmp` or another scratch directory, and run it as an
external reference project:

```bash
git clone https://github.com/ivancidev/gta6-landing-clone.git /tmp/ivancidev-gta6-landing-clone
cd /tmp/ivancidev-gta6-landing-clone
pnpm install
pnpm dev
```

Do not commit that clone, its dependencies, generated output or copied assets into this repo.

## Current Recommendation

Keep this as the second online GTA VI landing reference alongside `midu-gta-vi-hero`. Prefer it when
the live deployed behavior matters to the analysis, and prefer clean-room implementation for any
deliverable.
