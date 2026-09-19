# Grounded Studio Reference — Index and How to Use It

Neutral, runnable reference implementation for:

- `frontend-patterns/ui-components/procedural-horizon-hero/`;
- `frontend-patterns/site-compositions/grounded-editorial-studio/`.

It contains a complete full-viewport hero, a positioning continuation and two proof rows. Branding,
copy and data describe fictional **Northline Works** and do not reuse SDS identity, products,
locations, photographs, logos or letter geometry.

## Files

| File | Role |
|---|---|
| `demo/index.template.html` | Semantic source template with explicit escaped slots |
| `demo/build.mjs` | Dependency-free materializer; escapes content and rejects unresolved slots |
| `demo/package.json` | Declares local ESM mode and the dependency-free `build` script |
| `demo/index.html` | Generated, fully rendered static page; remains semantic without JS |
| `demo/site-content.js` | Single neutral business/copy ownership point |
| `demo/app.js` | Small progressive navigation behavior; owns no visible copy |
| `demo/styles.css` | Tokens, hero layers, section rhythm and responsive rules |
| `demo/hero-boot.js` | Cheap classic-script enhancement gate and lifecycle owner |
| `demo/hero-scene.js` | Optional imperative Three.js instanced landscape |

## Run

Materialize the static page after changing content, then serve `demo/` over HTTP:

```bash
node demo/build.mjs
python3 -m http.server 8808 --bind 127.0.0.1 --directory demo
```

Open `http://127.0.0.1:8808/`.

The optional scene imports pinned Three.js `0.185.1` from jsDelivr. If the network/import fails,
the complete CSS fallback remains. For production/offline use, self-host that exact module, retain
its MIT license, verify its digest, and change only `THREE_MODULE_URL` in `hero-scene.js`.

## Adaptation order

1. Copy the demo to a scratch target.
2. Replace only `site-content.js` and the complete CSS token block first, including RGB channel
   aliases used for alpha colors; run `node demo/build.mjs` after every content change.
3. Write a world sentence and quiet-corridor rule for the target.
4. Adjust `SCENE` in `hero-scene.js`; do not scatter visible values through renderer logic.
5. Replace proof visualizations with target-owned media or diagrams through its asset manifest.
6. Validate `1440×900`, `820×1180`, `390×844`, reduced motion, failed CDN and no JavaScript.

`index.html` is a derived artifact and must be committed together with its template/content input so
the sample runs without requiring Node at consumption time. Never hand-edit the generated file.

## Boundary

This sample demonstrates mechanism, not a drop-in brand. It deliberately avoids:

- SDS names, logo and products;
- original hero SVG, shaders, photographs and screenshots;
- copied typography files;
- analytics, forms, cookies or external business integrations.

## Provenance and license

The sample code is an SDS-owned clean-room generalization created from design behavior observed in
the owned `web-sds` project on 2026-08-22. It is stored in the legacy
`frontend-external-sample-code` category at the owner's requested path; unlike the third-party
reference notes beside it, this leaf contains runnable original sample code.

The optional runtime dependency is Three.js `0.185.1`, MIT licensed, loaded from a pinned public
URL and not vendored here.
