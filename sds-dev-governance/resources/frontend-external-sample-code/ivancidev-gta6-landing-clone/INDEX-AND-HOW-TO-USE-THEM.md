# Ivancidev GTA6 Landing Clone — How To Use This Reference

This is an external sample-code reference, not vendored source.

Upstream code URL: https://github.com/ivancidev/gta6-landing-clone
Live reference URL: https://gta6-landing-clone.vercel.app

## Load When

Load this resource when a prompt asks for:

- a cinematic landing hero;
- a game, entertainment, product-launch or trailer-style first viewport;
- a GTA VI landing-page reference with both source code and a live deployed sample;
- examples of Astro + React + GSAP + Lenis landing-page structure.

Do not load it for ordinary admin tools, dashboards, forms, SaaS settings pages or dense operational
interfaces.

## Do Not

- Do not vendor upstream source files into `sds-dev-governance`.
- Do not copy GTA/Rockstar logos, fonts, screenshots or brand assets.
- Do not treat the deployment as an owned asset source.
- Do not build a split text/media hero when the task calls for a first-viewport media scene.

It is acceptable to inspect the upstream code and run it locally in a temporary directory for
learning/debugging the pattern.

## Analysis Protocol

When a concrete project needs this pattern:

1. Re-check upstream status and license:
   - source URL: `https://github.com/ivancidev/gta6-landing-clone`
   - live URL: `https://gta6-landing-clone.vercel.app`
   - record branch, commit or tree SHA;
   - verify whether a license has been added.
2. Inspect only the relevant upstream files:
   - `package.json` for stack and animation dependencies;
   - `src/pages/index.astro` for route composition;
   - `src/components/Hero.astro` and `src/components/HeroAnimation.tsx` for hero structure and motion;
   - `src/components/Menu.astro` and `src/components/MenuAnimation.tsx` for continuation/menu motion;
   - `src/styles/hero.css`, `src/styles/menu.css` and `src/styles/global.css` for layout constraints;
   - assets only to understand layering, not to reuse them.
3. Compare source with live behavior:
   - confirm the deployment still returns 200;
   - capture desktop and mobile screenshots if the reference will drive implementation choices;
   - note runtime differences from source assumptions.
4. Write a short project-local extraction:
   - layers in the scene;
   - animation timeline;
   - scroll/menu behavior;
   - responsive behavior;
   - asset requirements;
   - accessibility and reduced-motion handling;
   - what must be rebuilt differently for the target brand.
5. Implement clean-room:
   - original/project-owned imagery;
   - local constants/config for visible copy and asset paths;
   - local design tokens;
   - stack-native components.
6. Verify:
   - desktop and mobile screenshots;
   - no text overlap;
   - hero leaves a hint of the next section where required;
   - motion works and respects reduced motion;
   - no third-party brand material is shipped accidentally.

## Local Run

Use a scratch path outside this repo or under `/tmp`:

```bash
git clone https://github.com/ivancidev/gta6-landing-clone.git /tmp/ivancidev-gta6-landing-clone
cd /tmp/ivancidev-gta6-landing-clone
pnpm install
pnpm dev
```

This is for observation and analysis. Keep the local clone uncommitted and separate from SDS
resources.

## Portable Pattern Summary

The transferable pattern is:

- full-viewport media-backed hero;
- layered foreground/background composition;
- brand/object-first signal;
- animation split across hero and menu/continuation components;
- GSAP timeline sequencing plus smooth-scroll behavior;
- live deployment as a visual comparison point;
- responsive constraints to keep the scene readable on mobile and desktop.

The non-transferable parts are the GTA/Rockstar brand, fonts, logos, imagery and exact source code.
