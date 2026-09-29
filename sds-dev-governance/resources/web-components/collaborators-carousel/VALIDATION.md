# Validation — collaborators-carousel

2026-09-29 · Node 24.19.0 · React 19.2.8 · Next 16.3.4 · TypeScript 5.9.3.
Verification: V2 | TypeScript + static Next build + real Chrome CDP | PASS.
Paths: model/props → React → local motion adapter → DOM engine/CSS → browser interaction.

- Three browser scenarios: 1440×1000 desktop, 390×844 touch emulation, 1440×1000 reduced motion.
- 22 assertions passed. Exact checks/results: `validation/desktop.json`, `touch.json`, `reduce.json`.
- Neutral screenshots: `preview/desktop.png`, `touch.png` (film also has viewer screenshot).
- Source engines preserved; provenance hashes identify exported bytes and source revision.
- Demos build without aliases to web-jia. Lockfiles resolve registry dependencies, not local links.

Reproduce with existing Chrome (no browser installer):

```bash
# Serve demo/out on a local origin after npm run build.
# CHROME_BIN must be the installed browser executable on this machine.
CHROME_BIN="<installed-chrome>" node demo/qa.mjs "<local-origin>" "<evidence-dir>" desktop
CHROME_BIN="<installed-chrome>" node demo/qa.mjs "<local-origin>" "<evidence-dir>" touch
CHROME_BIN="<installed-chrome>" node demo/qa.mjs "<local-origin>" "<evidence-dir>" reduce
```

Limits: Chromium emulation, not physical iOS/Android or Safari/Firefox certification. No screen
reader certification. Empty arrays and cleanup paths reviewed in code, not mounted in browser
fixtures. Data must follow the documented shape; arbitrary invalid URLs/media are caller errors.

Harness corrections during validation: offscreen lazy images must not be required to have loaded;
only visible images are asserted. Film keyboard activation supplies Enter text and moves the
mouse away from the modal's intentional mouse-leave close zone. These were test assumptions,
not product failures; final assertions exercise real input events and DOM outcomes.
