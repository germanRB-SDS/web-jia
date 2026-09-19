# Midu GTA VI Hero — How To Use This Reference

This is an external sample-code reference, not vendored source.

Upstream code URL: https://github.com/midudev/landing-gta-vi

## Load When

Load this resource when a prompt asks for:

- a cinematic landing hero;
- a game, entertainment, product-launch or trailer-style first viewport;
- a media-led hero with layered image composition and motion;
- examples of Astro + Tailwind + GSAP landing-page structure.

Do not load it for ordinary admin tools, dashboards, forms, SaaS settings pages or dense operational
interfaces.

## Do Not

- Do not vendor upstream source files into `sds-dev-governance`.
- Do not copy GTA logos, fonts, screenshots or brand assets.
- Do not use this reference to justify a generic gradient/orb hero.
- Do not build a split text/media hero when the task calls for a first-viewport media scene.

It is acceptable to inspect the upstream code and run it locally in a temporary directory for
learning/debugging the pattern.

## Analysis Protocol

When a concrete project needs this pattern:

1. Re-check upstream status and license:
   - source URL: `https://github.com/midudev/landing-gta-vi`
   - record branch, commit or tree SHA;
   - verify whether a license has been added.
2. Inspect only the relevant upstream files:
   - `package.json` for stack and animation dependencies;
   - `src/pages/index.astro` for composition and hero structure;
   - `src/layouts/Layout.astro` for global shell decisions;
   - assets only to understand layering, not to reuse them.
3. Write a short project-local extraction:
   - layers in the scene;
   - animation timeline;
   - responsive behavior;
   - asset requirements;
   - accessibility and reduced-motion handling;
   - what must be rebuilt differently for the target brand.
4. Implement clean-room:
   - original/project-owned imagery;
   - local constants/config for visible copy and asset paths;
   - local design tokens;
   - stack-native components.
5. Verify:
   - desktop and mobile screenshots;
   - no text overlap;
   - hero leaves a hint of the next section where required;
   - motion works and respects reduced motion;
   - no third-party brand material is shipped accidentally.

## Local Run

Use a scratch path outside this repo or under `/tmp`:

```bash
git clone https://github.com/midudev/landing-gta-vi.git /tmp/midu-gta-vi-hero
cd /tmp/midu-gta-vi-hero
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
- CTA and secondary metadata placed over the scene without card framing;
- timeline-based entrance and scroll motion;
- responsive constraints to keep the scene readable on mobile and desktop.

The non-transferable parts are the GTA VI brand, fonts, logos, imagery and exact source code.
