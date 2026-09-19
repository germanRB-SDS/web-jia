# Procedural Horizon Hero — Index and How to Use It

Portable full-viewport hero for a studio, product or place-led brand. It places editorial copy in
an intentionally quiet region of a procedural landscape, keeps a complete static fallback, and may
promote that fallback to a deferred WebGL scene without putting JavaScript or GPU availability on
the critical path.

Discovery aliases: `procedural-horizon-hero`, `landscape hero`, `field hero`, `quiet-corridor hero`,
`progressive WebGL hero`, `hero con paisaje procedural`.

## Use when

- the first viewport must establish a specific world rather than use a generic centered headline;
- the background can be described as repeated geometry plus one meaningful interruption;
- a static no-JS/reduced-motion version can tell the same story;
- the headline needs a stable contrast zone at every breakpoint.

Do not use it only to add spectacle. If the landscape, interruption and copy placement have no
relationship to the product or place, choose a simpler hero.

## Required inputs

Define these before markup or rendering code:

| Input | Required precision |
|---|---|
| World sentence | One sentence naming ground, repeated material, time/light and why it matters |
| Quiet-region rule | A geometric exclusion formula or authored mask; never “move it until readable” |
| Copy anchor | `left/center/right`, vertical band and maximum title/body measures |
| Palette roles | ground, sunk ground, primary ink, dim ink, action accent, atmospheric light,
  repeated material, haze |
| Fallback | Complete static background whose composition matches the enhanced scene |
| Enhanced scene | Optional; repeated geometry budget, camera profiles and lifecycle |
| Acceptance viewports | At minimum `1440×900`, `820×1180`, `390×844` |

## Layer contract

Use this exact order; changing it is a design decision, not an incidental `z-index` tweak.

| Layer | z-index | Responsibility |
|---|---:|---|
| Enhanced canvas | 0 | Optional 3D world; `pointer-events:none`, `aria-hidden:true` |
| Static fallback | 1 | Opaque resting world and hand-over surface |
| Persistent scrim | 2 | Contrast protection; it survives after the fallback is removed |
| Copy/actions | 3 | Semantic content and the only interactive elements in the hero |
| Edge annotations | 3 | Optional place/measure and scroll cue; remove if they compete on narrow screens |

The scrim must not live inside the element that gets clipped away during hand-over. Otherwise the
enhanced scene can destroy text contrast at exactly the moment it appears.

## Baseline geometry and copy values

These values form a complete starting contract, so an implementer does not have to guess:

```css
.world-hero {
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding-block: 8rem 4rem;
  overflow: hidden;
}

.world-hero__title {
  max-width: 13ch;
  font-size: clamp(2.6rem, 1rem + 6.6vw, 6rem);
  line-height: .94;
  letter-spacing: -.038em;
}

.world-hero__summary {
  max-width: 46ch;
  margin-top: 1.5rem;
  font-size: clamp(1.0625rem, 1rem + .4vw, 1.25rem);
  line-height: 1.55;
}
```

- Desktop copy anchor: page gutter, vertically centered, left third.
- Desktop quiet region: diagonal corridor through the left half; its near width must be at least
  the title measure plus one gutter.
- Narrow (`<=780px`): copy uses the full content width; replace the side scrim with a vertical
  scrim whose darkest band covers roughly 30–76% of the viewport height.
- Portrait enhancement: widen the camera (`fov` about `55–58`), reduce repeated geometry to about
  45% of desktop, and hide any decorative focal object that sits behind the paragraph.
- Edge annotations are hidden at `<=780px`.

## Fallback contract

The fallback is the hero, not a loading placeholder. It must render with:

- JavaScript disabled;
- failed dynamic import or blocked CDN;
- WebGL unavailable or context lost;
- `prefers-reduced-motion: reduce`;
- data-saver enabled;
- print styles.

It must contain the same ground, horizon, quiet region and light direction as the enhanced scene.
An SVG, CSS perspective grid or optimized raster may be used. A raster needs provenance and
responsive derivatives; a procedural fallback needs deterministic seed/geometry.

## Enhancement gate and hand-over

1. Load only a small classic `defer` boot script eagerly.
2. Reject enhancement for reduced motion, save-data, missing canvas/host and missing WebGL.
3. Wait for `load`, then `requestIdleCallback({timeout:2500})` or a `320ms` timeout fallback.
4. Dynamically import the scene; do not statically import the 3D dependency from the boot gate.
5. Keep the fallback unchanged on any exception.
6. After a real first frame, expose the canvas beneath the still-opaque fallback.
7. Move one top-to-bottom clip front from `0%` to `100%`. Each pixel belongs to one layer; do not
   cross-fade two structurally different landscapes.
8. When the front is complete, set the fallback to `display:none`; keep the scrim.

If a shader reveal is used, the shader and CSS clip must consume the same normalized front value.
Lead the CSS clip by the shader softness band so no row shows both layers.

## Three.js scene budget

The reference sample uses imperative Three.js because the target is static/vanilla and needs direct
render-loop control.

- `PerspectiveCamera`; desktop `fov:42–50`, narrow `50`, portrait `56`.
- Cap DPR at `2`; coarse pointer at `1.5–1.6`.
- Use `InstancedMesh` for more than 100 repeated plots.
- Prefer one material for all repeated geometry and no shadow maps.
- Target `<=6` draw calls for the portable sample and `<=8` for a branded implementation.
- No per-frame allocation: reuse vectors, quaternion/euler, dummy object and colors.
- Use `renderer.setAnimationLoop()`, not raw `requestAnimationFrame`.
- Update camera aspect and call `updateProjectionMatrix()` on resize.
- Pause when the hero is off-screen or `document.hidden`.
- On teardown: stop the loop, remove listeners/observers, traverse and dispose geometry/material,
  cancel any in-flight hand-over frame, then `renderer.dispose()`. A late dynamic import must check
  the disposed state before creating a renderer.

## Motion and interaction

- One authored entrance: landscape ignition/hand-over and staggered copy surface belong to the same
  gesture.
- Pointer movement may produce at most a few degrees of damped camera parallax. It must not suggest
  that decorative geometry is clickable.
- Use frame-rate-independent damping: `1 - Math.exp(-lambda * dt)` or `MathUtils.damp`.
- Content is visible in every animation state. The portable sample uses only a small translated
  `from` state with `animation-fill-mode: backwards`; do not use `opacity:0`, blur or clipping as the
  sole initial representation unless a no-animation override is guaranteed. JS never owns content
  visibility.
- Reduced motion declines the enhanced scene instead of spending a GPU context on a still duplicate.

## Accessibility and performance gates

- The canvas and fallback decoration are `aria-hidden`; heading, summary and actions remain HTML.
- Contrast is evaluated against the brightest enhanced frame, not only the fallback.
- The first interactive control remains reachable without crossing the canvas.
- No canvas pointer listeners are needed; listen passively on `window` only when running.
- The enhanced dependency is not requested before `load`.
- Failure is silent visually but diagnosable in development; production keeps the fallback.

## Integration sequence

1. Define target-project tokens, copy/i18n ownership and one business-info entry point.
2. Write the world sentence and quiet-region formula.
3. Build the semantic hero and complete fallback first.
4. Validate all acceptance viewports and reduced motion before adding WebGL.
5. Add the enhancement gate, scene, lifecycle and hand-over.
6. Revalidate contrast, layer ownership, no-JS, failed import, off-screen pause and cleanup.

## Reference implementation

Use the neutral runnable sample at
`../../../frontend-external-sample-code/grounded-studio-reference/`. Its `hero-boot.js` demonstrates
the gate/lifecycle and `hero-scene.js` demonstrates an instanced field with a quiet corridor. Copy
the mechanism, then replace tokens, content and world geometry through the target ownership layer.

## Acceptance checklist

- [ ] Title is readable before and after enhancement at all three required viewports.
- [ ] Static fallback remains complete with JS/WebGL/CDN unavailable.
- [ ] No cross-fade double image occurs during hand-over.
- [ ] Scrim survives fallback removal.
- [ ] Narrow copy never sits on the brightest material.
- [ ] Reduced motion makes no 3D request.
- [ ] Renderer stops off-screen/hidden and disposes on teardown.
- [ ] Action accent is reserved for action/focus; atmospheric light and data signal have separate
  tokens even when their hues are related.
- [ ] All values required to reproduce the composition are in tokens/config, not renderer logic.

## Provenance

Clean-room pattern extracted from the owned `web-sds` “Mar de Plástico” implementation on
2026-08-22. It intentionally excludes SDS logos, wordmarks, letter geometry, copy, photos and
business information. The reusable mechanism is the layered composition and progressive lifecycle.
